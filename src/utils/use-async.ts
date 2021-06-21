import {useState} from "react";


interface State <D> {
    error: Error | null;
    data: D | null;
    stat: "idle" | "loading" | "error" | "success";

}


const defaultInitialState:State<null> = {
    stat: "idle",
    data: null,
    error: null
}

const defaultConfig = {
    throwOnError: false,
};

export const useAsync = <D>(
    initialState ?:State<D>,
    initialConfig?: typeof defaultConfig
)=>{
    const config = { ...defaultConfig, ...initialConfig };

    const [retry, setRetry] = useState(()=>()=>{

    })
    const [state, setState] = useState<State<D>>({
        ...defaultInitialState,
        ...initialState
    });

    const setData = (data: D) =>
        setState({
            data,
            stat: "success",
            error: null,
        });


    const setError = (error: Error)=>
        setState({
            error,
            stat: "error",
            data: null,
        });

    // run 用来触发异步请求
    const run = (promise: Promise<D>, runConfig?: {retry: ()=>Promise<D>})=>{
        if (!promise || !promise.then) {
            throw new Error("请传入 Promise 类型数据");
        }
        setRetry(()=>()=>{
            if(runConfig?.retry){
                run(runConfig?.retry(), runConfig)
            }
        })
        setState({ ...state, stat: "loading" });
        return promise
            .then((data) => {
                setData(data);
                return data;
            })
            .catch((error) => {
                // catch会消化异常， 如果不主动抛出，外面是接收不到异常的
                setError(error);
                if (config.throwOnError) return Promise.reject(error);  // 加这个判断主要是因为 纯异步的时候使用setError ，同步代码不要使用
                return error
            });
    }

    return {
        isIdle: state.stat === "idle",
        isLoading: state.stat === "loading",
        isError: state.stat === "error",
        isSuccess: state.stat === "success",
        run,
        setData,
        setError,
        retry,
        ...state,
    };

}
