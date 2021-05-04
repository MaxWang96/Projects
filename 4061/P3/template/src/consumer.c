#include "consumer.h"

/**
 * parse lines from the queue, and count words by word length
 */
void parse(char *line, int *count) {
    char *buf;
    char *saveBuf;
    int len = strlen(line);
    if (line[len - 1] == '\n') line[len - 1] = '\0';
    buf = strtok_r(line, " ", &saveBuf);
    while (buf != NULL) {
        count[strlen(buf) - 1]++;
        buf = strtok_r(NULL, " ", &saveBuf);
    }
}

// consumer function
void *consumer(void *arg) {
    //TODO: keep reading from queue and process the data
    // feel free to change
    if (logFp != NULL) fprintf(logFp, "consumer %d\n", *(int *)arg);
    int count[20];
    for (;;) {
        pthread_mutex_lock(&listLock);
        while (items->length == 0 && !items->done) {
            pthread_cond_wait(&queue, &listLock);
        }
        if (items->length == 0 && items->done) {
            pthread_mutex_unlock(&listLock);
            break;
        }
        pthread_mutex_lock(&lineCountLock);
        if (logFp != NULL) fprintf(logFp, "consumer %d: %d\n", *(int *)arg, lineNum);
        lineNum++;
        pthread_mutex_unlock(&lineCountLock);
        node *item = items->begin->next;
        items->begin->next = item->next;
        if (item->next == NULL) {
            items->end = items->begin;
        }
        items->length--;
        if (items->bound != 0) pthread_cond_broadcast(&queue);
        pthread_mutex_unlock(&listLock);
        parse(item->line, count);
        free(item->line);
        free(item);
    }

    pthread_mutex_lock(&histoLock);
    for (int i = 0; i < 20; i++) {
        histogram[i] += count[i];
    }
    pthread_mutex_unlock(&histoLock);
    free(arg);
    return NULL;
}
