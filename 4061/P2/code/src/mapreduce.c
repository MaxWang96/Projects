#include "mapreduce.h"

void traverseInputFileDirectory(int nMappers);
void makePipes(int n);
void closePipes(int n);

int main(int argc, char *argv[]) {
    // TODO: number of argument check
    if (argc != 4) {
        fprintf(stderr, "usage: mapreduce nMappers nReducers inputFileDir");
        return 1;
    }

    int nMappers = strtol(argv[1], NULL, 10);
    int nReducers = strtol(argv[2], NULL, 10);

    inputFileDir = argv[3];
    if (!isValidDir(inputFileDir)) exit(EXIT_FAILURE);

    bookeepingCode();

    // TODO: Traverse Input File Directory (Hint: Recursively find all the text
    // files inside directory) and create MapperInput directory which will
    // contain MapperID.txt files
    traverseInputFileDirectory(nMappers);

    // TODO: spawn stream processes
    for (int i = 0; i < nMappers; i++) {
        int fd[2];
        pipe(fd);
        char buf[3];
        snprintf(buf, 2, "%d", i + 1);
        if (fork() == 0) {
            execl("stream", "stream", buf, argv[1], NULL);
        }
        if (fork() == 0) {
            execl("mapper", "mapper", buf, NULL);
        }
        close(fd[0]);
        close(fd[1]);
    }

    // TODO: wait for all children to complete execution
    while (wait(NULL) > 0)
        ;

    // TODO: spawn reducers
    for (int i = 0; i < nReducers; i++) {
        if (fork() == 0) {
            char buf[3];
            sprintf(buf, "%d", i + 1);
            execl("reducer", "reducer", buf, argv[2], inputFileDir, NULL);
        }
    }

    // TODO: wait for all children to complete execution
    while (wait(NULL) > 0)
        ;

    return EXIT_SUCCESS;
}

void traverseHelper(char *path, char fileName[][maxFileNameLength],
                    int *entry) {
    DIR *dir = opendir(path);
    struct dirent *de;
    while ((de = readdir(dir)) != NULL) {
        if (strcmp(de->d_name, ".") && strcmp(de->d_name, "..")) {
            char buf[maxFileNameLength];
            char tmp[maxFileNameLength];
            int bytesWriten =
                snprintf(buf, maxFileNameLength, "%s/%s", path, de->d_name);
            if (bytesWriten > maxFileNameLength) exit(1);

            if (de->d_type == DT_DIR) {
                traverseHelper(buf, fileName, entry);
            } else if (de->d_type == DT_REG) {
                struct stat st;
                stat(buf, &st);
                if (st.st_nlink == 1) {
                    if (strcmp(de->d_name + strlen(de->d_name) - 3, "txt") ==
                        0) {
                        strcpy(fileName[*entry], buf);
                        *entry += 1;
                    }
                }
            }
        }
    }
    closedir(dir);
}

void writeToDir(char fileName[][maxFileNameLength], int tasks[], int n,
                int total) {
    int idxToWrite = 0;
    for (int i = 0; i < n; i++) {
        char nameBuf[15];
        char pathBuf[maxFileNameLength];
        int bytesWriten;
        bytesWriten = snprintf(nameBuf, 14, "Mapper%d.txt", i + 1);
        if (bytesWriten > 14) exit(1);
        bytesWriten = snprintf(pathBuf, maxFileNameLength, "%s/%s",
                               "MapperInput", nameBuf);
        if (bytesWriten > maxFileNameLength) exit(1);
        int fd = open(pathBuf, O_WRONLY | O_CREAT | O_TRUNC, 0777);
        for (int j = i; j < total; j += n) {
            char writeBuf[maxFileNameLength];
            bytesWriten = snprintf(writeBuf, maxFileNameLength, "%s\n",
                                   fileName[idxToWrite]);
            if (bytesWriten > maxFileNameLength) exit(1);
            write(fd, writeBuf, strlen(writeBuf));
            idxToWrite++;
        }
        close(fd);
    }
}

void traverseInputFileDirectory(int nMappers) {
    char fileName[MaxNumInputFiles][maxFileNameLength];
    int entry = 0;
    int tasks[nMappers];
    traverseHelper(inputFileDir, fileName, &entry);
    mkdir("MapperInput", 0777);
    writeToDir(fileName, tasks, nMappers, entry);
}