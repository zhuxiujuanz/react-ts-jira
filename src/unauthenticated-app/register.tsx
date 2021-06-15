import React from "react";
import { useAuth } from "context/auth-context";
import { Form, Input } from "antd";
import { LongButton } from "unauthenticated-app/index";

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
const apiUrl = process.env.REACT_APP_API_URL;

export const RegisterScreen = ({onError}:{onError:(error:Error)=>void}) => {
    const { register, user } = useAuth();

    // HTMLFormElement extends Element
    const handleSubmit = async ({cpassword, ...values}: { username: string; password: string, cpassword:string }) => {
        // register(values).catch(onError); //如果不想用try catch风格可以直接在register 后面用catch
        if (cpassword !== values.password) {
            onError(new Error("请确认两次输入的密码相同"));
            return;
        }

        // register(values).catch(onError); //如果不想用try catch风格可以直接在login 后面用catch
        // 不需要在给handleSubmit方法加上async 这种方式是可以获取到报错信息的，因为login是异步的，所以当login执行完成之后才会执行catch

        // try catch的这种方式是不行的，因为register是异步，而try catch 中的catch是同步的，register还没执行完成，几句执行了catch
        // 所以获取不到错误信息， 此时需要在handleSubmit方法加上async
        try{
            await register(values);
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
            <Form.Item
                name={"cpassword"}
                rules={[{ required: true, message: "请确认密码" }]}
            >
                <Input placeholder={"确认密码"} type="password" id={"cpassword"} />
            </Form.Item>
            <Form.Item>
                <LongButton  htmlType={"submit"} type={"primary"}>
                    注册
                </LongButton>
            </Form.Item>
        </Form>
    );
};
