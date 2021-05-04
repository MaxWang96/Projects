#include "mapper.h"

/**
 * Write word count that is stored in an intermediate data structure to files.
 * The file should be in a corresponding folder in output/IntermediateData/ 
 */
void writeInterDSToFiles(void)
{
    for (int i = 0; i < MaxWordLength; i++)
    {
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
 * parse lines from pipes, and count words by word length
 */
void parse(char *line)
{
    char *buf;
    buf = strtok(line, " ");
    while (buf != NULL)
    {
        interDS[strlen(buf) - 1]++;
        buf = strtok(NULL, " ");
    }
}

int main(int argc, char *argv[])
{

    mapperID = strtol(argv[1], NULL, 10);

    // you can read lines from pipes (from STDIN) (read lines in a while loop)
    // feel free to change
    dup2(3, STDIN_FILENO);
    close(3);
    close(4);

    char buf[chunkSize];
    int charRead;
    while ((charRead = getLineFromFile(stdin, buf, chunkSize)) > 0)
    {
        if (buf[charRead - 1] == '\n')
        {
            buf[charRead - 1] = '\0';
        }
        parse(buf);
    }

    writeInterDSToFiles();

    close(STDIN_FILENO);

    return EXIT_SUCCESS;
}