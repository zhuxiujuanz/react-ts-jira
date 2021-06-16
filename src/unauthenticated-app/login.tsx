import React from "react";
import { useAuth } from "context/auth-context";
import { Form, Input } from "antd";
import { LongButton } from "unauthenticated-app/index";
import {useAsync} from "../utils/use-async";

// interface Base {
//   id: number
// }
//
// interface Advance extends Base {
//   name: string
// }
//
// const test = (p: Base) => {
// }
//
// // 鸭子类型(duck typing)：面向接口编程 而不是 面向对象编程
// const a = {id: 1, name: 'jack'}
// test(a)

export const LoginScreen = ({onError}:{onError:(error:Error)=>void}) => {
    const { login } = useAuth();
    const { run, isLoading } = useAsync(undefined, { throwOnError: true });
    // HTMLFormElement extends Element
    const handleSubmit = async (values: { username: string; password: string }) => {
        // login(values).catch(onError); //如果不想用try catch风格可以直接在login 后面用catch
        // 不需要在给handleSubmit方法加上async 这种方式是可以获取到报错信息的，因为login是异步的，所以当login执行完成之后才会执行catch

        // try catch的这种方式是不行的，因为login是异步，而try catch 中的catch是同步的，login还没执行完成，几句执行了catch
        // 所以获取不到错误信息， 此时需要在handleSubmit方法加上async
        try{
            await run(login(values));
        }catch (e) {
            onError(e)
        }
    };

    return (
        <Form onFinish={handleSubmit}>
            <Form.Item
                name={"username"}
                rules={[{ required: true, message: "请输入用户名" }]}
            >
                <Input placeholder={"用户名"} type="text" id={"username"} />
            </Form.Item>
            <Form.Item
                name={"password"}
                rules={[{ required: true, message: "请输入密码" }]}
            >
                <Input placeholder={"密码"} type="password" id={"password"} />
            </Form.Item>
            <Form.Item>
                <LongButton loading={isLoading} htmlType={"submit"} type={"primary"}>
                    登录
                </LongButton>
            </Form.Item>
        </Form>
    );
};
