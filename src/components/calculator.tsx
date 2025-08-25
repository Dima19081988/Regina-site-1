import { useState } from "react";
import '../styles/calculator.css';

type Operation = "+" | "-" | "*" | "/" | null;


export const Calculator = () => {

    const [currValue, setCurrValue] = useState<string>('0');
    const [prevValue, setPrevValue] = useState<string>('');
    const [operation, setOperation] = useState<Operation>(null);
    const [overwrite, setOverwrite] = useState<boolean>(false);

    const digits = ['1','2','3','4','5','6','7','8','9'];

    const handleDigit = (digit: string) => {
        if (overwrite) {
            setCurrValue(digit);
            setOverwrite(false);
        } else {
            setCurrValue(currValue === "0" ? digit : currValue + digit);
        }
    }

    const handleClear = () => {
        setCurrValue('0');
        setPrevValue('');
        setOperation(null);
        setOverwrite(false);
    }

    const handleDelete = () => {
        if (overwrite) {
            setCurrValue('0');
            setOverwrite(false);
            return;
        }
        if (currValue.length === 1) {
            setCurrValue('0')
            setOverwrite(false);
        } else {
            setCurrValue(currValue.slice(0, -1))
        }
    }

    const handleDecimal = () => {
        if (overwrite) {
            setCurrValue('0.');
            setOverwrite(false);
            return;
        }
        if (!currValue.includes('.')) {
            setCurrValue(currValue + '.')
        }
    }


    const chooseOperation = (op: Operation) => {
        if (op === '/' && currValue === '0') {
            return;
        }
        if(prevValue) {
            const result = compute(prevValue, currValue, operation);
            setPrevValue(result);
            setCurrValue(result);
        } else {
            setPrevValue(currValue);
        }

        setOperation(op);
        setOverwrite(true);
    }

    const handleResult = () => {
        if (!prevValue || !operation) return;
        const result = compute(prevValue, currValue, operation);
        setCurrValue(result);
        setPrevValue('');
        setOperation(null);
        setOverwrite(true);
    }

    const compute = (prevValue: string, currValue: string, operation: Operation) => {
        const prev = parseFloat(prevValue);
        const curr = parseFloat(currValue);

        if (Number.isNaN(prev) || Number.isNaN(curr)) {
            return '0';
        }
        switch(operation) {
            case '+':
                return (prev + curr).toString();
            case '-':
                return (prev - curr).toString();
            case '*':
                return (prev * curr).toString();
            case '/':
                if (curr === 0) return "Ошибка деления на ноль"
                return (prev / curr).toString();
            default:
                return '0';
        }
    }

    return (
        <div className="calculator">
            <div className="display">
                <div className="prev">
                    {prevValue} {operation}
                </div>
                <div className="curr">
                    {currValue}
                </div>
            </div>
            <div className="buttons">
                    <button onClick={handleClear}>AC</button>
                    <button onClick={handleDelete}>DEL</button>
                    <button onClick={handleDecimal}>.</button>
                    <button onClick={handleResult}>=</button>
                    <button onClick={() => chooseOperation('+')}>+</button>
                    <button onClick={() => chooseOperation('-')}>-</button>
                    <button onClick={() => chooseOperation('*')}>*</button>
                    <button onClick={() => chooseOperation('/')}>/</button>
                    
                    {digits.map((digit) => (
                        <button key={digit} onClick={() => handleDigit(digit)}>{digit}</button>
                    ))}
                    <button onClick={() => handleDigit('0')} className="zero">0</button>
                    
            </div>
        </div>
    )
}
