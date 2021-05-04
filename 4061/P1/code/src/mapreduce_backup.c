#include "mapreduce.h"

int main(int argc, char *argv[])
{

	//TODO: number of argument check
	if (argc != 4)
	{
		printf("Usage: %s #mappers #reducers inputFile", argv[1]);
		return 1;
	}

	int nMappers = strtol(argv[1], NULL, 10);
	int nReducers = strtol(argv[2], NULL, 10);

	inputFileDir = argv[3];
	if (!isValidDir(inputFileDir))
		exit(EXIT_FAILURE);

	bookeepingCode();

	// TODO: spawn mappers
	pid_t child_pid;
	int i;
	char id[3];

	for (i = 0; i < nMappers; i++)
	{
		child_pid = fork();
		if (!child_pid)
		{
			sprintf(id, "%d", i + 1);
			execl("mapper", "mapper", id, argv[1], argv[3], NULL);
		}
	}

	// TODO: wait for all children to complete execution
	while(wait(NULL) > 0);

	// TODO: spawn reducers
	for (i = 0; i < nReducers; i++)
	{
		child_pid = fork();
		if (!child_pid)
		{
			sprintf(id, "%d", i + 1);
			execl("reducer", "reducer", id, argv[2], argv[3], NULL);
		}
	}

	// TODO: wait for all children to complete execution
	while(wait(NULL) > 0);

	return EXIT_SUCCESS;
}