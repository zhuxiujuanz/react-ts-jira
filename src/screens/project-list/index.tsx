import React, {useMemo,useCallback, useState, memo} from "react";
import { SearchPanel } from "screens/project-list/search-panel";
import { List } from "screens/project-list/list";
import {  useDebounce,useDocumentTitle,  } from "../../utils";
import {Button, Typography} from "antd";

import styled from "@emotion/styled";

import {useProjects} from "../../utils/project";
import {useUsers} from "../../utils/user";
import {useUrlQueryParam} from "../../utils/url"
import {useProjectsSearchParams} from "./util";
// 使用 JS 的同学，大部分的错误都是在 runtime(运行时) 的时候发现的
// 我们希望，在静态代码中，就能找到其中的一些错误 -> 强类型

export const ProjectListScreen = () => {
    // const [param, setParam] = useState({
    //     name: "",
    //     personId: "",
    // });

    const [param, setParam] = useProjectsSearchParams();
    const debouncedParam = useDebounce(param, 200);
    const {isLoading, error, data:list, retry} = useProjects(debouncedParam)
    const {data:users} = useUsers()
    useDocumentTitle("项目列表", false);
    console.log(useUrlQueryParam(['name']))
    return (
        <Container>
            <h1>项目列表</h1>
            {/*<Button onClick={retry}>retry</Button>*/}
            <SearchPanel users={users || []} param={param} setParam={setParam} />
            {error ? (
                <Typography.Text type={"danger"}>{error.message}</Typography.Text>
            ) : null}
            <List refresh={retry} loading={isLoading} users={users || []} dataSource={list || []} />
        </Container>
    );
};
ProjectListScreen.whyDidYouRender = false;

const Container = styled.div`
  padding: 3.2rem;
`;
