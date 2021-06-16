import {useSearchParams} from "react-router-dom";

/**
 * 返回页面url中，指定健的参数值
 */
export const useUrlQueryParam = (keys: string[]) =>{
    const [searchParams, setSearchParam] = useSearchParams();
    return [
        keys.reduce((prev, key)=>{
            return {...prev, [key] : searchParams.get(key) || ''}
        }, {} as {[key in string] : string}),
        setSearchParam
    ] as const
}

// as cont的作用
// const a = ['jack', 12, {gender: 'male'}] as const
