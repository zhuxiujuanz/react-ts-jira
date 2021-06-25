import { Project } from "screens/project-list/list";
import { useHttp } from "utils/http";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {useProjectsSearchParams} from "../screens/project-list/util";

export const useProjects = (param?: Partial<Project>) => {
    const client = useHttp();

    return useQuery<Project[]>(["projects", param], () =>
        client("projects", { data: param })
    );
};

export const useEditProject = () => {
    const client = useHttp();
    const queryClient = useQueryClient(); // 用于缓存的交互
    const [searchParams] = useProjectsSearchParams();
    const queryKey = ['projects',searchParams];
    return useMutation(
        (params: Partial<Project>) =>
            client(`projects/${params.id}`, {
                method: "PATCH",
                data: params,
            }),

        {

            onSuccess: () => queryClient.invalidateQueries("projects"),
            async onMutate(target){
                const previousItems = queryClient.getQueryData(queryKey);
                queryClient.setQueryData(queryKey, (old?: Project[])=>{
                    return old?.map(project =>project.id === target.id ? {...project, ...target} : {...project}) || []
                })
                return  previousItems
            },
            onError(error, newItem, context:any){
                queryClient.setQueryData(queryKey, context.previousItems)
            }
        }
    );
};

export const useAddProject = () => {
    const client = useHttp();
    const queryClient = useQueryClient();

    return useMutation(
        (params: Partial<Project>) =>
            client(`projects`, {
                data: params,
                method: "POST",
            }),
        {
            onSuccess: () => queryClient.invalidateQueries("projects"),
        }
    );
};

export const useProject = (id?: number) => {
    const client = useHttp();
    return useQuery<Project>(
        ["project", { id }],
        () => client(`projects/${id}`),
        {
            enabled: Boolean(id),
        }
    );
};
