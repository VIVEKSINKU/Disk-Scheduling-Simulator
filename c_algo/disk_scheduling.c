#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "disk_scheduling.h"

static int int_abs(int x) { return x < 0 ? -x : x; }

static int cmp_asc(const void *a, const void *b) {
    return (*(const int *)a) - (*(const int *)b);
}

// FCFS

SchedulingResult fcfs(const int *requests, int count, int initial_head) {
    SchedulingResult r;
    r.seq_len = 0;
    r.total_distance = 0;

    r.sequence[r.seq_len++] = initial_head;

    int current = initial_head;
    for (int i = 0; i < count; i++) {
        r.total_distance += int_abs(requests[i] - current);
        current = requests[i];
        r.sequence[r.seq_len++] = current;
    }
    return r;
}

// SSTF

SchedulingResult sstf(const int *requests, int count, int initial_head) {
    SchedulingResult r;
    r.seq_len = 0;
    r.total_distance = 0;

    /* copy requests so we can mark served ones */
    int pending[MAX_REQUESTS];
    int served[MAX_REQUESTS] = {0};
    for (int i = 0; i < count; i++) pending[i] = requests[i];

    r.sequence[r.seq_len++] = initial_head;
    int current = initial_head;

    for (int done = 0; done < count; done++) {
        int best_idx = -1;
        int best_dist = __INT_MAX__;
        for (int i = 0; i < count; i++) {
            if (!served[i]) {
                int d = int_abs(pending[i] - current);
                if (d < best_dist) {
                    best_dist = d;
                    best_idx = i;
                }
            }
        }
        served[best_idx] = 1;
        r.total_distance += best_dist;
        current = pending[best_idx];
        r.sequence[r.seq_len++] = current;
    }
    return r;
}

// SCAN

SchedulingResult scan(const int *requests, int count, int initial_head,
                      int max_cylinder, int direction) {
    SchedulingResult r;
    r.seq_len = 0;
    r.total_distance = 0;

    int sorted[MAX_REQUESTS];
    for (int i = 0; i < count; i++) sorted[i] = requests[i];
    qsort(sorted, count, sizeof(int), cmp_asc);

    int left[MAX_REQUESTS], left_n = 0;
    int right[MAX_REQUESTS], right_n = 0;
    for (int i = 0; i < count; i++) {
        if (sorted[i] < initial_head) left[left_n++] = sorted[i];
        else                          right[right_n++] = sorted[i];
    }

    int path[MAX_REQUESTS * 2 + 4], path_n = 0;

    if (direction) { /* Up */
        for (int i = 0; i < right_n; i++) path[path_n++] = right[i];
        path[path_n++] = max_cylinder - 1;
        for (int i = left_n - 1; i >= 0; i--) path[path_n++] = left[i];
    } else { /* Down */
        for (int i = left_n - 1; i >= 0; i--) path[path_n++] = left[i];
        path[path_n++] = 0;
        for (int i = 0; i < right_n; i++) path[path_n++] = right[i];
    }

    int current = initial_head;
    r.sequence[r.seq_len++] = current;
    for (int i = 0; i < path_n; i++) {
        if (path[i] != current) {
            r.total_distance += int_abs(path[i] - current);
            current = path[i];
            r.sequence[r.seq_len++] = current;
        }
    }
    int clean[MAX_REQUESTS * 2 + 4], clean_n = 0;
    clean[clean_n++] = r.sequence[0];
    for (int i = 1; i < r.seq_len; i++) {
        if (r.sequence[i] != clean[clean_n - 1])
            clean[clean_n++] = r.sequence[i];
    }
    for (int i = 0; i < clean_n; i++) r.sequence[i] = clean[i];
    r.seq_len = clean_n;

    return r;
}

// C-SCAN

SchedulingResult cscan(const int *requests, int count, int initial_head,
                       int max_cylinder, int direction) {
    SchedulingResult r;
    r.seq_len = 0;
    r.total_distance = 0;

    int sorted[MAX_REQUESTS];
    for (int i = 0; i < count; i++) sorted[i] = requests[i];
    qsort(sorted, count, sizeof(int), cmp_asc);

    int left[MAX_REQUESTS], left_n = 0;
    int right[MAX_REQUESTS], right_n = 0;
    for (int i = 0; i < count; i++) {
        if (sorted[i] < initial_head) left[left_n++] = sorted[i];
        else                          right[right_n++] = sorted[i];
    }

    int path[MAX_REQUESTS * 2 + 4], path_n = 0;

    if (direction) { /* Up */
        for (int i = 0; i < right_n; i++) path[path_n++] = right[i];
        path[path_n++] = max_cylinder - 1;
        path[path_n++] = 0;
        for (int i = 0; i < left_n; i++) path[path_n++] = left[i];
    } else { /* Down */
        for (int i = left_n - 1; i >= 0; i--) path[path_n++] = left[i];
        path[path_n++] = 0;
        path[path_n++] = max_cylinder - 1;
        for (int i = right_n - 1; i >= 0; i--) path[path_n++] = right[i];
    }

    int current = initial_head;
    r.sequence[r.seq_len++] = current;
    for (int i = 0; i < path_n; i++) {
        if (path[i] != current) {
            r.total_distance += int_abs(path[i] - current);
            current = path[i];
            r.sequence[r.seq_len++] = current;
        }
    }

    int clean[MAX_REQUESTS * 2 + 4], clean_n = 0;
    clean[clean_n++] = r.sequence[0];
    for (int i = 1; i < r.seq_len; i++) {
        if (r.sequence[i] != clean[clean_n - 1])
            clean[clean_n++] = r.sequence[i];
    }
    for (int i = 0; i < clean_n; i++) r.sequence[i] = clean[i];
    r.seq_len = clean_n;

    return r;
}

// CLI test harness

#ifndef __EMSCRIPTEN__
static void print_result(const char *name, SchedulingResult *res) {
    printf("\n=== %s ===\n", name);
    printf("Sequence: ");
    for (int i = 0; i < res->seq_len; i++) {
        printf("%d", res->sequence[i]);
        if (i < res->seq_len - 1) printf(" -> ");
    }
    printf("\nTotal Seek Distance: %d\n", res->total_distance);
}

int main(void) {
    int requests[] = {98, 183, 37, 122, 14, 124, 65, 67};
    int count = sizeof(requests) / sizeof(requests[0]);
    int head = 50;
    int max_cyl = 200;

    SchedulingResult r;

    r = fcfs(requests, count, head);
    print_result("FCFS", &r);

    r = sstf(requests, count, head);
    print_result("SSTF", &r);

    r = scan(requests, count, head, max_cyl, 1);
    print_result("SCAN (Up)", &r);

    r = cscan(requests, count, head, max_cyl, 1);
    print_result("C-SCAN (Up)", &r);

    return 0;
}
#endif
