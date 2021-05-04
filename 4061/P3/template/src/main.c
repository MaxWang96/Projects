#include "header.h"

/**
 * Write final word count to a single file.
 * The path name should be output/result.txt
 */
void writeFinalDSToFiles(void) {
    char buf[10];
    for (int i = 0; i < MaxWordLength; i++) {
        if (histogram[i]) {
            int bytePrint = snprintf(buf, 10, "%d %d\n", i + 1, histogram[i]);
            if (bytePrint > 10) exit(1);
            writeLineToFile(finalDir, buf);
        }
    }
}

int main(int argc, char *argv[]) {
    //Argument check
    if (argc < 3 || argc > 5) {
        fprintf(stderr, "Usage: ./mapreduce #consumers inputFile [option] [#queueSize]\n");
        return 1;
    }
    int nConsumers = atoi(argv[1]);
    pthread_t producerId;
    pthread_t consumerId[nConsumers];

    bookeepingCode();

    //Initialize global variables, like shared queue
    pthread_mutex_init(&listLock, NULL);
    pthread_mutex_init(&lineCountLock, NULL);
    pthread_mutex_init(&histoLock, NULL);
    pthread_cond_init(&queue, NULL);
    items = malloc(sizeof(ll_t));
    node sentinel;
    items->begin = &sentinel;
    items->end = &sentinel;
    items->length = 0;
    items->done = 0;
    histogram = calloc(MaxWordLength, sizeof(int));
    lineNum = 0;
    if (argc >= 4) {
        if (strcmp(argv[3], "-p") == 0 || strcmp(argv[3], "-bp") == 0) {
            logFp = fopen(logDir, "w");
        } else {
            logFp = NULL;
        }
        if (strcmp(argv[3], "-b") == 0 || strcmp(argv[3], "-bp") == 0) {
            if (argc != 5) {
                fprintf(stderr, "Invalid Input: no buffer size\n");
                return 1;
            }
            items->bound = atoi(argv[4]);
        } else {
            items->bound = 0;
        }
    }

    //create producer and consumer threads
    pthread_create(&producerId, NULL, producer, argv[2]);
    for (int i = 0; i < nConsumers; i++) {
        int *id = malloc(sizeof(int));
        *id = i;
        pthread_create(consumerId + i, NULL, consumer, id);
    }

    //wait for all threads to complete execution
    pthread_join(producerId, NULL);
    for (int i = 0; i < nConsumers; i++) {
        pthread_join(consumerId[i], NULL);
    }

    //Write the final output
    writeFinalDSToFiles();

    //TODO: free all the items
    free(items);
    free(histogram);
    if (logFp != NULL) fclose(logFp);

    return 0;
}
