'use strict';

var exiting = false;

function exit() {
	if(!exiting)
	{
		process.exit(0);
	}
	exiting = true;
}

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
process.on('SIGTKILL', exit);
