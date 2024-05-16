import express from "express";

interface RequestWithBody<T> extends express.Request {
    body: T;
}

export default RequestWithBody;
