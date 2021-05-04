#include "mapper.h"

/**
 * Write word count that is stored in a intermeidate data structure to files.
 * The file should be in a corresponding folder in output/IntermediateData/ 
 */
void writeInterDSToFiles(void) {
    for (int i = 0; i < MaxWordLength; i++) {
        char tmp[40];
        char dirBuf[15];
        char conBuf[10];
        strcpy(tmp, intermediateDir);
        sprintf(dirBuf, "/%d/m_%d.txt", i + 1, mapperID);
        strcat(tmp, dirBuf);
        sprintf(conBuf, "%d %d", i + 1, interDS[i]);
        writeLineToFile(tmp, conBuf);
    }
}

/**
 * Read lines from files, and count words by word length
 */
void map(char * inputFileName) {
    FILE *fp = getFilePointer(inputFileName);
    size_t MaxLineLength = 100;
    char buf[MaxLineLength];
    char *token;
    while (getLineFromFile(fp, buf, MaxLineLength) > 0) {
        char *newline = strchr(buf, '\n');
        if (newline != NULL) {
            *newline = 0;
        }
        token = strtok(buf, " ");
        while (token != NULL) {
            interDS[strlen(token) - 1]++;
            token = strtok(NULL, " ");
        }
    }
}

int main(int argc, char *argv[]) {

    mapperID = strtol(argv[1], NULL, 10);
    int nMappers = strtol(argv[2], NULL, 10);
    inputFileDir = argv[3];

    //getMapperTasks function returns a list of input file names that this mapper should process
    char *myTasks[MaxNumInputFiles] = {NULL};
    int nTasks = getMapperTasks(nMappers, mapperID, inputFileDir, &myTasks[0]);

    int tIdx;
    for (tIdx = 0; tIdx < nTasks; tIdx++) {
        printf("mapper[%d] - %s\n", mapperID, myTasks[tIdx]);
        map(myTasks[tIdx]);
        free(myTasks[tIdx]);
    }

    writeInterDSToFiles();

    return EXIT_SUCCESS;
}