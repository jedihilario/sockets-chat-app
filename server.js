const { Server } = require('net');

const END = 'EXIT';
const HOST = '0.0.0.0'
const connections = new Map();

const error = (err) => {
    console.error(err);
    process.exit(1);
}

const sendMessage = (msg, origin) => {
    for (const socket of connections.keys()) {
        if(socket !== origin) {
            socket.write(msg);
        }
    }
}

const listen = ( port ) => {
    const server = new Server();

    server.on('connection', ( socket ) => {
        socket.setEncoding('utf-8');

        socket.on('data', ( data ) => {
            if(!connections.has(socket)) {
                connections.set(socket, data);                
            } else if(data === END) {
                connections.delete(socket);
                socket.end();
            } else {
                const fullMessage = `[${connections.get(socket)}]: ${data}`;
                console.log(fullMessage);
                sendMessage(fullMessage, socket);
            }
        });
    });

    server.listen({ port , HOST }, () => {
        console.log(`Listening on port ${port}`)
    });

    server.on('error', ( err ) => error(err.message));
}

const main = () => {
    if(process.argv.length != 3) error(`Usage: node ${__filename} $PORT`);
    
    if(isNaN(process.argv[2])) error(`Invalid port ${port}: must be a number`);

    const port = Number(process.argv[2]);

    listen(port);
}

if(require.main === module) {
    main();
}
