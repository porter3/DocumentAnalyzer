package com.jakeporter.DocumentAnalyzer.exceptions;

public class TXTIssueException extends RuntimeException {

    public TXTIssueException(String message) {
        super(message);
    }

    public TXTIssueException(String message, Throwable e) {
        super(message, e);
    }
}
