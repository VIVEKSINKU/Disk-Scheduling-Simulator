#ifndef DISK_SCHEDULING_H
#define DISK_SCHEDULING_H

#define MAX_REQUESTS 1024

typedef struct {
    int sequence[MAX_REQUESTS * 2 + 4]; 
    int seq_len;
    int total_distance;
} SchedulingResult;

SchedulingResult fcfs(const int *requests, int count, int initial_head);
SchedulingResult sstf(const int *requests, int count, int initial_head);
SchedulingResult scan(const int *requests, int count, int initial_head,
                      int max_cylinder, int direction);
SchedulingResult cscan(const int *requests, int count, int initial_head,
                       int max_cylinder, int direction);

#endif
