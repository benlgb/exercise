import React, { useCallback, useRef, useState } from 'react';
import './App.css';

import type { FormEvent } from 'react';

/**
 * 已知有一个远程加法
 * @param a
 * @param b
 * @returns
 */
async function addRemote(a: number, b: number) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return a + b;
}

/**
 * 请实现本地的 add 方法，调用 addRemote，能最优的实现输入数字的加法。
 * @example
 * ```
 * add(5, 6).then(result => {
 *   console.log(result); // 11
 * });
 * add(1, 4, 3, 3, 5).then(result => {
 *   console.log(result); // 16
 * })
 * add(2, 3, 3, 3, 4, 1, 3, 3, 5).then(result => {
 *   console.log(result); // 27
 * })
 * ```
 */
async function add(...inputs: number[]) {
    if (inputs.length === 0) {
        return 0;
    }

    // 数据
    const numbers = [...inputs];

    // 等待进程
    const waiting = new Set<Promise<void>>();

    // 获取结果
    while (numbers.length > 1 || waiting.size > 0) {
        while (numbers.length > 1) {
            const process = addRemote(numbers.pop()!, numbers.pop()!).then(
                result => {
                    numbers.push(result);
                    waiting.delete(process);
                }
            );

            waiting.add(process);
        }

        if (waiting.size > 0) {
            await Promise.race(waiting);
        }
    }

    return numbers[0];
}

// 默认提示文本
const PLACEHOLDER_MESSAGE = '待输入中';

// 错误输入提示文本
const ERROR_MESSAGE = '请输入正确数字';

// 加载中提示文本
const LOADING_MESSAGE = '计算结果中';

function App() {
    const newest = useRef(Symbol('newest'));
    const input = useRef<HTMLInputElement | null>(null);
    const [result, setResult] = useState(PLACEHOLDER_MESSAGE);

    const clickHandler = useCallback(async () => {
        if (input.current?.value) {
            const numbers = input.current.value
                .split(',')
                .map(number => Number(number));

            for (const number of numbers) {
                if (Number.isNaN(number)) {
                    setResult(ERROR_MESSAGE);
                    return;
                }
            }

            if (numbers.length > 0) {
                setResult(LOADING_MESSAGE);
                const symbol = Symbol('newest');
                newest.current = symbol;
                console.time('number');
                const number = await add(...numbers);
                console.timeEnd('number');

                // 忽略旧请求
                if (symbol === newest.current) {
                    setResult(number.toString());
                }

                return;
            }
        }

        setResult(ERROR_MESSAGE);
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    请实现add 方法，当用户在输入框中输入多个数字(逗号隔开)后，
                </div>
                <div>点击相加按钮能显示最终结果</div>
            </header>
            <section className="App-content">
                <input
                    ref={input}
                    type="text"
                    placeholder="请输入要相加的数字（如1,3,4,5,6）"
                />
                <button onClick={clickHandler}>相加</button>
            </section>
            <section className="App-result">
                <p>
                    相加结果是：<span>{result}</span>
                </p>
            </section>
        </div>
    );
}

export default App;
