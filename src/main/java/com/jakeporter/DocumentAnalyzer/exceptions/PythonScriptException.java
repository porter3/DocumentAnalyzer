package com.jakeporter.DocumentAnalyzer.exceptions;

public class PythonScriptException extends RuntimeException {

    public PythonScriptException(String message) {
        super(message);
    }

    public PythonScriptException(String message, Throwable e) {
        super(message, e);
    }
}
