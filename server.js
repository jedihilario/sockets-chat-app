const { Server } = require('net');

const END = 'EXIT';
const HOST = '0.0.0.0'

const error = (err) => {
    console.error(err);
    process.exit(1);
}

const listen = ( port ) => {
    const server = new Server();

    server.on('connection', ( socket ) => {
        socket.setEncoding('utf-8');

        socket.on('data', ( data ) => {
            if(data === END) {
                socket.end()
            } else {
                console.log(data);
            }
        });
    });

    server.listen({ port , HOST }, () => {
        console.log('Listening on port 8000')
    });

    server.on('error', ( err ) => error(err.message));
}

const main = () => {
    if(process.argv.length != 3) {
        error(`Usage: node ${__filename} $PORT`);
    }

    let port = process.argv[2];

    if(isNaN(port)) error(`Invalid port ${port}: must be a number`);

    port = Number(port);

    listen(port);
}

if(require.main === module) {
    main();
}