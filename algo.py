def fcfs(requests, initial_head):
    sequence = [initial_head] + requests
    distance = 0
    for i in range(len(sequence) - 1):
        distance += abs(sequence[i+1] - sequence[i])
    return sequence, distance
def sstf(requests, initial_head):
    sequence = [initial_head]
    distance = 0
    pending = requests.copy()
    current_head = initial_head
    
    while pending:
        next_request = min(pending, key=lambda r: abs(r - current_head))
        distance += abs(next_request - current_head)
        sequence.append(next_request)
        current_head = next_request
        pending.remove(next_request)
    
    return sequence, distance

def scan(requests, initial_head,max_cylinder,direction="Up"):
    sequence = [initial_head]
    distance = 0
    current_head = initial_head
    sorted_requests = sorted(requests)

    left = [r for r in sorted_requests if r<initial_head]
    right = [r for r in sorted_requests if r>=initial_head]
    if direction =="Up":
        path = right + [max_cylinder-1] + left[::-1]
    else:
        path = left[::-1] + [0] + right
    for req in path:
        if req != current_head:
            sequence.append(req)
            distance += abs(req - current_head)
            current_head = req
    clean_seq = [sequence[0]]
    for i in sequence[1:]:
        if i != clean_seq[-1]:
            clean_seq.append(i)
    return clean_seq, distance

def cscan(requests, initial_head,max_cylinder,direction="Up"):
    sequence = [initial_head]
    distance = 0
    current_head = initial_head
    sorted_requests = sorted(requests)
    left = [r for r in sorted_requests if r<initial_head]
    right = [r for r in sorted_requests if r>=initial_head]
    if direction == "Up":
        path = right + [max_cylinder-1,0]+ left
    else:
        path = left[::-1] + [0,max_cylinder-1] + right[::-1]
    for req in path:
        if req != current_head:
            sequence.append(req)
            distance += abs(req - current_head)
            current_head = req
    clean_seq = [sequence[0]]
    for i in sequence[1:]:
        if i != clean_seq[-1]:
            clean_seq.append(i) 
    return clean_seq, distance