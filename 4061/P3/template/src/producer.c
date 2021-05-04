#include "producer.h"

/**
 *
 * Producer thread will read from the file and write data to 
 * the end of the shared queue
 */
void *producer(void *arg) {
    //TODO: open the file and read its content line by line
    //Send data to the shared queue
    //When reaching the end of the file, send EOF message to the sha
    char *filePath = (char *)arg;
    FILE *fp = getFilePointer(filePath);
    if (logFp != NULL) fprintf(logFp, "producer\n");
    char buf[chunkSize];
    char *lineBuf;
    int byteRead;
    int lineNum = 0;
    while ((byteRead = getLineFromFile(fp, buf, chunkSize)) >= 0) {
        if (logFp != NULL) fprintf(logFp, "producer: %d\n", lineNum);
        lineNum++;
        if (buf[0] != '\n') {
            node *item = malloc(sizeof(node));
            lineBuf = malloc(sizeof(char) * (byteRead + 1));
            strcpy(lineBuf, buf);
            item->line = lineBuf;
            item->next = NULL;
            pthread_mutex_lock(&listLock);
            if (items->bound != 0) {
                while (items->length >= items->bound) {
                    pthread_cond_wait(&queue, &listLock);
                }
            }
            items->end->next = item;
            items->end = item;
            items->length++;
            pthread_cond_signal(&queue);
            pthread_mutex_unlock(&listLock);
        }
    }
    pthread_mutex_lock(&listLock);
    items->done = 1;
    pthread_mutex_unlock(&listLock);
    if (logFp != NULL) fprintf(logFp, "producer: -1\n");
    pthread_cond_broadcast(&queue);
    // cleanup and exit
    fclose(fp);
    return NULL;
}
