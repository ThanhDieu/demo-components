import { ApiParamsRequest, HttpResponse } from "@/interfaces/common.interfaces";
import { Env } from "@/libs/Env.mjs";
import HttpService from "@/services/HttpServices";
import { I__Name__ } from '@/interfaces/mini-app/__lowerName__.interfaces';

const baseUrl = Env.NEXT_PUBLIC_KONG_API_URL + '/api';

class __Name__Service {
  private apis = {
    root: 'merchant/__lowerName__',
  };

  get__Name__List = async (params: ApiParamsRequest) => {
    const res = await HttpService.get<HttpResponse<I__Name__[]>>(`${baseUrl}/${this.apis.root}`, {
      ...params,
    });
    return res;
  };

  get__Name__ById = async (id: string) => {
    const res = await HttpService.get<HttpResponse<I__Name__>>(`${baseUrl}/${this.apis.root}/${id}`);
    return res;
  };
}

export const __lowerName__Service = new __Name__Service();
