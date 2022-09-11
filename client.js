const { Socket } = require('net');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const END = 'EXIT';

const error = (err) => {
    console.error(err);
    process.exit(1);
}

const connect = (host, port) => {
    const socket = new Socket();

    socket.connect({ host, port });
    socket.setEncoding('utf-8');

    socket.on('connect', () => {
        console.log('Connected!');

        readline.question('Choose your username: ', ( username ) => {
            socket.write(username);
            console.log(`Type any message to send it, type ${END} to exit`);
        });
        
        readline.on('line', ( line ) => {
            socket.write(line);
            if(line === END) {
                socket.end()
            }
        })
    
        socket.on('data', ( data ) => {
            console.log(data);
        });
    })

    socket.on( 'error', ( err ) => error(err.message) );

    socket.on('close', () => {
        console.log('Disconnected');
        process.exit(0);
    })
}

const main = () => {
    if(process.argv.length != 4) error(`Usage: node ${__filename} $HOST $PORT`);

    if(isNaN(process.argv[3])) error(`Invalid port ${port}: must be a number`);

    const [, , host, port] = process.argv;

    connect(host, port);
}

if(require.main === module) {
    main();
}