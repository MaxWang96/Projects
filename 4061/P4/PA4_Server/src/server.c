#include <arpa/inet.h>
#include <netdb.h>
#include <netinet/in.h>
#include <pthread.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <zconf.h>

#include "../include/protocol.h"

typedef struct worker_arg_t {
    int sock;
    struct sockaddr_in client_addr;
} worker_arg_t;
int histogram[WORD_LENGTH_RANGE];
int client_status[MAX_NUM_CLIENTS];
pthread_mutex_t histo_lock = PTHREAD_MUTEX_INITIALIZER;
pthread_mutex_t status_lock = PTHREAD_MUTEX_INITIALIZER;

void *worker(void *arg);

int main(int argc, char *argv[]) {
    // process input arguments
    if (argc != 2) {
        fprintf(stderr, "Usage: ./server <Server Port>\n");
        return EXIT_FAILURE;
    }

    short port = atoi(argv[1]);

    // socket create and verification
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock == -1) {
        perror("Failed to create socket");
        return EXIT_FAILURE;
    }

    // assign IP, PORT
    struct sockaddr_in server = {
        .sin_family = AF_INET,
        .sin_port = htons(port),
        .sin_addr.s_addr = htonl(INADDR_ANY)};

    // Binding newly created socket to given IP
    if (bind(sock, (struct sockaddr *)&server, sizeof(server))) {
        perror("Failed to bind");
        return EXIT_FAILURE;
    }

    // Now server is ready to listen
    if (listen(sock, 10)) {
        perror("Failed to listen");
        return EXIT_FAILURE;
    }
    printf("server is listening\n");

    pthread_attr_t thread_attr;
    pthread_attr_init(&thread_attr);
    pthread_attr_setdetachstate(&thread_attr, PTHREAD_CREATE_DETACHED);

    while (1) {
        // Accept the data packet from client
        struct sockaddr_in client;
        socklen_t len;
        pthread_t tid;
        int client_sock = accept(sock, (struct sockaddr *)&client, &len);
        if (client_sock == -1) {
            perror("Failed to accept");
            return EXIT_FAILURE;
        }
        printf("open connection from %s:%d\n", inet_ntoa(client.sin_addr), client.sin_port);
        worker_arg_t *args = malloc(sizeof(worker_arg_t));
        args->sock = client_sock;
        args->client_addr = client;
        pthread_create(&tid, &thread_attr, worker, args);
    }
    exit(EXIT_SUCCESS);
}

void *worker(void *arg) {
    worker_arg_t *args = arg;
    int client_sock = args->sock;
    struct sockaddr_in client_addr = args->client_addr;
    int request[REQUEST_MSG_SIZE];
    int short_response_size = RESPONSE_MSG_SIZE * sizeof(int);
    for (;;) {
        int bytes_read = read(client_sock, request, sizeof(request));
        if (bytes_read == 0) {
            break;
        }
        int code = request[RQS_CODE_NUM];
        int client_id = request[RQS_CLIENT_ID];
        int persistent = request[RQS_PERSISTENT_FLAG];
        int response[LONG_RESPONSE_MSG_SIZE] = {code, RSP_OK};
        if ((code < 1 || code > 4) || client_id <= 0) {
            memset(response, 0, short_response_size);
            write(client_sock, response, RESPONSE_MSG_SIZE);
            break;
        } else if (code == UPDATE_WSTAT) {
            printf("[%d] UPDATE_WSTAT\n", client_id);
            pthread_mutex_lock(&histo_lock);
            for (int i = 0; i < WORD_LENGTH_RANGE; i++) {
                if (request[RQS_DATA + i] < 0) {
                    memset(response, 0, short_response_size);
                    write(client_sock, response, RESPONSE_MSG_SIZE);
                    printf("close connection from %s:%d\n", inet_ntoa(client_addr.sin_addr), (int)client_addr.sin_port);
                    close(client_sock);
                    free(args);
                    return NULL;
                }
                histogram[i] += request[RQS_DATA + i];
            }
            pthread_mutex_unlock(&histo_lock);
            pthread_mutex_lock(&status_lock);
            client_status[client_id - 1]++;
            pthread_mutex_unlock(&status_lock);
            response[RSP_DATA] = client_id;
            write(client_sock, response, short_response_size);
        } else if (code == GET_MY_UPDATES) {
            printf("[%d] GET_MY_UPDATE\n", client_id);
            pthread_mutex_lock(&status_lock);
            response[RSP_DATA] = client_status[client_id - 1];
            pthread_mutex_unlock(&status_lock);
            write(client_sock, response, short_response_size);
        } else if (code == GET_ALL_UPDATES) {
            printf("[%d] GET_ALL_UPDATES\n", client_id);
            int sum = 0;
            pthread_mutex_lock(&status_lock);
            for (int i = 0; i < MAX_NUM_CLIENTS; i++) {
                sum += client_status[i];
            }
            pthread_mutex_unlock(&status_lock);
            response[RSP_DATA] = sum;
            write(client_sock, response, short_response_size);
        } else {
            printf("[%d] GET_WSTAT\n", client_id);
            pthread_mutex_lock(&histo_lock);
            memcpy(response + RSP_DATA, histogram, sizeof(histogram));
            pthread_mutex_unlock(&histo_lock);
            write(client_sock, response, sizeof(response));
        }
        if (!persistent)
            break;
    }
    close(client_sock);
    printf("close connection from %s:%d\n", inet_ntoa(client_addr.sin_addr), (int)client_addr.sin_port);
    free(args);
    return NULL;
}
