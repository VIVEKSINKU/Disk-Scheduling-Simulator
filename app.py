import streamlit as st
import plotly.graph_objects as go
import pandas as pd
# from scheduler import fcfs, sjf, sstf, scan, cscan

st.set_page_config(page_title="Disk Scheduling Simulator", layout="wide",page_icon="💽")
st.title("💽Disk Scheduling Simulator ")
st.markdown("A visualizer for disk scheduling algorithms")

st.sidebar.header("Configuration")
request_input = st.sidebar.text_input("Disk Requests (comma separated)", "98, 183, 37, 122, 14, 124, 65, 67")
initial_head = st.sidebar.number_input("Initial Head Position", min_value=0, value=50 )
max_cylinder = st.sidebar.number_input("Maximum Cylinder Number", min_value=1, value=200)

algorithm = st.sidebar.selectbox("Algorithm", ["FCFS", "SJF", "SSTF", "SCAN", "C-SCAN"])
direction = st.sidebar.selectbox("Direction (for SCAN/C-SCAN)", ["Up", "Down"])

try:
    requests = [int(x.strip()) for x in request_input.split(",") if x.strip()]
except ValueError:
    st.error("Please enter valid integers separated by commas for Disk Requests.")
    st.stop()
valid_requests = [r for r in requests if 0 <= r < max_cylinder]
if len(valid_requests) != len(requests):
    st.warning(f"Some requests were ignored because they are outside the range [0, {max_cylinder - 1}].")
    requests = valid_requests
if not requests:
    st.info("wait for valid requests.")
    st.stop()
if initial_head >= max_cylinder:
    st.error(f"Initial head position must be less than {max_cylinder}.")
    st.stop()
if algorithm == "FCFS":
    sequence,distance  = fcfs(requests, initial_head)
elif algorithm == "SJF":
    sequence,distance  = sjf(requests, initial_head)
elif algorithm == "SCAN":
    sequence,distance  = scan(requests, initial_head, direction, max_cylinder)
elif algorithm == "C-SCAN":
    sequence,distance  = cscan(requests, initial_head, direction, max_cylinder)

avg_seek_time = distance/len(requests) if requests else 0
throughput = len(requests) / distance if distance > 0 else 0

st.markdown(f"### Performance Metrics")
col1,col2,col3 = st.columns(3)
col1.metric("Total Seek Distance", distance)
col2.metric("Average Seek Time", f"{avg_seek_time:.2f}")
col3.metric("Throughput", f"{throughput:.2f} req/time")

st.subheader("Head Movement Visualization")

