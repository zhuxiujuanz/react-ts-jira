/** @jsxImportSource @emotion/react */
import React from "react";
import { Form, Input } from "antd";
import { Project } from "screens/project-list/list";
import { UserSelect } from "components/user-select";
// 这个地方和老师讲解使用的不同，但是因为@emotion在React17的适配问题（@jsxImportSource/@jsxRuntime的作用）暂时替换成上面那种
export interface User {
    id: number;
    name: string;
    email: string;
    title: string;
    organization: string;
    token: string;
}

interface SearchPanelProps {
    users: User[];
    param: Partial<Pick<Project, "name" | "personId">>;
    setParam: (param: SearchPanelProps["param"]) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
    // @ts-ignore
    return <Form css={{ marginBottom: "2rem" }} layout={"inline"}>
        <Form.Item>
            {/*setParam(Object.assign({}, param, {name:evt.target.value}))*/}
            <Input
                placeholder={"项目名"}
                type="text"
                value={param.name}
                onChange={(evt) =>
                    setParam({
                        ...param,
                        name: evt.target.value,
                    })
                }
            />
        </Form.Item>
        <Form.Item>
            <UserSelect
                defaultOptionName={"负责人"}
                value={param.personId}
                onChange={(value) =>
                    setParam({
                        ...param,
                        personId: value,
                    })
                }
            />
        </Form.Item>
    </Form>;
};
