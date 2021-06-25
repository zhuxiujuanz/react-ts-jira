import { Project } from "screens/project-list/list";
import { useHttp } from "utils/http";
import { QueryKey,useMutation, useQuery, useQueryClient } from "react-query";
import {useProjectsSearchParams} from "../screens/project-list/util";
import {
    useAddConfig,
    useDeleteConfig,
    useEditConfig,
} from "utils/use-optimistic-options";
export const useProjects = (param?: Partial<Project>) => {
    const client = useHttp();

    return useQuery<Project[]>(["projects", param], () =>
        client("projects", { data: param })
    );
};

export const useEditProject = (queryKey: QueryKey) => {
    const client = useHttp();
    return useMutation(
        (params: Partial<Project>) =>
            client(`projects/${params.id}`, {
                method: "PATCH",
                data: params,
            }),

        useEditConfig(queryKey)
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


export const useDeleteProject = (queryKey: QueryKey) => {
    const client = useHttp();

    return useMutation(
        ({ id }: { id: number }) =>
            client(`projects/${id}`, {
                method: "DELETE",
            }),
        useDeleteConfig(queryKey)
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
