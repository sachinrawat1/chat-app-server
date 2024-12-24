"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketEvents = void 0;
const handleSocketEvents = (io, socket) => {
    console.log(`users connected with id:${socket.id}`);
};
exports.handleSocketEvents = handleSocketEvents;
