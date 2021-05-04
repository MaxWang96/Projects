#include "reducer.h"

/**
 * Write final word count to files.
 * The file should be in a corresponding folder in output/FinalData/ 
 */
void writeFinalDSToFiles(void)
{
    for (int i = 0; i < MaxWordLength; i++)
    {
        if (finalDS[i] != 0)
        {
            char tmp[25];
            char dirBuf[10];
            char conBuf[10];
            strcpy(tmp, finalDir);
            sprintf(dirBuf, "/%d.txt", i + 1);
            strcat(tmp, dirBuf);
            sprintf(conBuf, "%d %d", i + 1, finalDS[i]);
            writeLineToFile(tmp, conBuf);
        }
    }
}

/**
 * Read lines from files, and calculate a total count for a specific word length
 */
void reduce(char *intermediateFileName)
{
    FILE *fp = getFilePointer(intermediateFileName);
    size_t MaxLineLength = 10;
    char buf[MaxLineLength];
    char *rest;
    char *end;
    getLineFromFile(fp, buf, MaxLineLength);
    int len = strtol(buf, &rest, 10);
    int count = strtol(rest, &end, 10);
    finalDS[len - 1] += count;
}

int main(int argc, char *argv[])
{

    // initialize
    reducerID = strtol(argv[1], NULL, 10);
    int nReducers = strtol(argv[2], NULL, 10);

    //getReducerTasks function returns a list of intermediate file names that this reducer should process
    char *myTasks[MaxNumIntermediateFiles] = {NULL};
    int nTasks = getReducerTasks(nReducers, reducerID, intermediateDir, &myTasks[0]);

    int tIdx;
    for (tIdx = 0; tIdx < nTasks; tIdx++)
    {
        printf("reducer[%d] - %s\n", reducerID, myTasks[tIdx]);
        reduce(myTasks[tIdx]);
        free(myTasks[tIdx]);
    }

    writeFinalDSToFiles();

    return EXIT_SUCCESS;
}