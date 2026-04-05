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

