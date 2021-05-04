#include "stream.h"

/**
 * read lines from input file and write each line to pipes
 * each line will contain words as in Project 1 (Use STDOUT for writing)
 */
void emit(char *inputFileName)
{
    FILE *fp = getFilePointer(inputFileName);
    char buf[chunkSize];
    int bytes;
    while ((bytes = getLineFromFile(fp, buf, chunkSize)) > 0)
    {
        if (buf[bytes - 1] != '\n') {
            buf[bytes] = '\n';
            bytes++;
        }
        printf("%.*s", bytes, buf);
    }
    fflush(stdout);
}
/***
 *
 * Stream process will read from the files created by Master
 */
int main(int argc, char *argv[])
{

    mapperID = strtol(argv[1], NULL, 10);
    int nMappers = strtol(argv[2], NULL, 10);

    char *ipFdr = "MapperInput/Mapper";

    //TODO: Read lines from Mapper files and get the file names that will be processes in emit function
    //Each MapperInput/MapperID.txt file will contain file names
    // example of one line will be test/T1/subfolder/0.txt
    dup2(4, STDOUT_FILENO);
    close(3);
    close(4);

    char fileName[maxFileNameLength];
    char lineBuf[maxFileNameLength];
    int bytesWriten;
    int charRead;
    bytesWriten = snprintf(fileName, maxFileNameLength, "%s%d.txt", ipFdr, mapperID);
    if (bytesWriten > maxFileNameLength)
        exit(1);
    FILE *fp = getFilePointer(fileName);

    while ((charRead = getLineFromFile(fp, lineBuf, maxFileNameLength)) > 0)
    {
        lineBuf[charRead - 1] = '\0';
        emit(lineBuf);
    }
    close(STDOUT_FILENO);
    return EXIT_SUCCESS;
}