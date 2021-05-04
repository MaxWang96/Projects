#include <arpa/inet.h>
#include <ctype.h>
#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <zconf.h>

#include "../include/protocol.h"

FILE *logfp;

void createLogFile(void) {
    pid_t p = fork();
    if (p == 0)
        execl("/bin/rm", "rm", "-rf", "log", NULL);

    wait(NULL);
    mkdir("log", 0777);
    logfp = fopen("log/log_client.txt", "w");
}

int sendRequests(int client_id, int client_num, struct sockaddr_in server_addr, char *path);

int main(int argc, char *argv[]) {
    // process input arguments
    if (argc != 6) {
        fprintf(stderr, "Usage: ./client <Folder Name> <# of Clients> <Server IP> <Server Port> -e\n");
        return EXIT_FAILURE;
    }
    int client_num = atoi(argv[2]);
    if (client_num > 20 || client_num <= 0) {
        fprintf(stderr, "Client number should be a positive integer not greater than 20\n");
        return EXIT_FAILURE;
    }
    in_addr_t server_ip = inet_addr(argv[3]);
    short server_port = atoi(argv[4]);
    pid_t child;
    int i = 1;

    // create log file
    createLogFile();

    // spawn client processes
    for (; i <= client_num; i++) {
        child = fork();
        if (child == 0) {
            break;
        }
    }
    if (child == 0) {
        struct sockaddr_in server_addr = {
            .sin_family = AF_INET,
            .sin_port = htons(server_port),
            .sin_addr.s_addr = server_ip};
        sendRequests(i, client_num, server_addr, argv[1]);
        fclose(logfp);
        return EXIT_SUCCESS;
    }

    // wait for all client processes to terminate
    while (wait(NULL) > 0)
        ;

    // close log file
    fclose(logfp);

    return EXIT_SUCCESS;
}

int read_words(char *path, int *count) {
    FILE *fp = fopen(path, "r");
    if (fp == NULL)
        return 1;
    char buf[1024];
    memset(count, 0, WORD_LENGTH_RANGE * sizeof(int));
    while (fgets(buf, 1024, fp)) {
        char *token = strtok(buf, "\n");
        token = strtok(token, " ");
        while (token != NULL) {
            count[strlen(token) - 1]++;
            token = strtok(NULL, " ");
        }
    }
    fclose(fp);
    return 0;
}

int sendRequests(int client_id, int client_num, struct sockaddr_in server_addr, char *path) {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock == -1) {
        perror("Failed to create socket");
        exit(EXIT_FAILURE);
    }
    if (connect(sock, (struct sockaddr *)&server_addr, sizeof(server_addr))) {
        perror("Failed to connect to server");
        exit(EXIT_FAILURE);
    }
    fprintf(logfp, "[%d] open connection\n", client_id);

    int request[REQUEST_MSG_SIZE] = {0};
    request[RQS_CLIENT_ID] = client_id;
    request[RQS_PERSISTENT_FLAG] = 1;
    int response[LONG_RESPONSE_MSG_SIZE] = {0};
    int short_response_size = RESPONSE_MSG_SIZE * sizeof(int);

    request[RQS_CODE_NUM] = UPDATE_WSTAT;
    char path_buf[200];
    int file_num = client_id;
    int update_count = 0;
    while (1) {
        snprintf(path_buf, 200, "%s/%d.txt", path, file_num);
        int is_empty = read_words(path_buf, request + RQS_DATA);
        if (is_empty)
            break;
        write(sock, request, sizeof(request));
        read(sock, response, short_response_size);
        if (response[RSP_RSP_CODE_NUM] == RSP_NOK) {
            fprintf(logfp, "[%d] close connection (failed execution)\n", client_id);
            close(sock);
            return 1;
        }
        update_count++;
        file_num += client_num;
    }
    fprintf(logfp, "[%d] UPDATE_WSTAT: %d\n", client_id, update_count);

    request[RQS_CODE_NUM] = GET_MY_UPDATES;
    memset(request + RQS_DATA, 0, WORD_LENGTH_RANGE * sizeof(int));
    write(sock, request, sizeof(request));
    read(sock, response, short_response_size);
    if (response[RSP_RSP_CODE_NUM] == RSP_NOK) {
        fprintf(logfp, "[%d] close connection (failed execution)\n", client_id);
        close(sock);
        return 1;
    }
    fprintf(logfp, "[%d] GET_MY_UPDATES: %d %d\n", client_id, response[RSP_RSP_CODE_NUM], response[RSP_DATA]);

    request[RQS_CODE_NUM] = GET_ALL_UPDATES;
    write(sock, request, sizeof(request));
    read(sock, response, short_response_size);
    if (response[RSP_RSP_CODE_NUM] == RSP_NOK) {
        fprintf(logfp, "[%d] close connection (failed execution)\n", client_id);
        close(sock);
        return 1;
    }
    fprintf(logfp, "[%d] GET_ALL_UPDATES: %d %d\n", client_id, response[RSP_RSP_CODE_NUM], response[RSP_DATA]);

    request[RQS_CODE_NUM] = GET_WSTAT;
    write(sock, request, sizeof(request));
    read(sock, response, sizeof(response));
    if (response[RSP_RSP_CODE_NUM] == RSP_NOK) {
        fprintf(logfp, "[%d] close connection (failed execution)\n", client_id);
        close(sock);
        return 1;
    }
    fprintf(logfp, "[%d] GET_WSTAT: %d", client_id, response[RSP_RSP_CODE_NUM]);
    for (int i = 0; i < WORD_LENGTH_RANGE; i++) {
        fprintf(logfp, " %d", *(response + RSP_DATA + i));
    }
    fprintf(logfp, "\n");

    fprintf(logfp, "[%d] close connection (successful execution)\n", client_id);
    close(sock);
    return 0;
}
