import { Injectable, InternalServerErrorException } from '@nestjs/common';
import graphQLConfig from '../config/graphql.json'; 
import strapiConfig from '../config/strapi.json'; 
import { GraphQLClient, gql } from 'graphql-request'
import axios from 'axios';
const graphQLNoAuthClient = new GraphQLClient(graphQLConfig.url)

@Injectable()
export class AuthService {
    async login(_identifier: string, _password: string): Promise<any> {
        return await axios.post(strapiConfig.url+'auth/local',{
            identifier : _identifier, 
            password :_password

        }).then(resp => {
            if(!resp.data.user.role.name.toString().includes('swim')) throw new InternalServerErrorException('Internal Server Error');
            else {
                return {
                    username : resp.data.user.username,
                    email:  resp.data.user.email,
                    organization : resp.data.user.organization,
                    jwt : resp.data.jwt, 
                    refresh : resp.data.refresh, 
                    role : resp.data.user.role.name
                    
                }
            }

        }).catch(()=>{
            throw new InternalServerErrorException('Internal Server Error');
        })
    }
    async uamLogin(_identifier: string, _password: string): Promise<any> {
        
        return await axios.post(strapiConfig.url+'auth/local',{
            identifier : _identifier, 
            password :_password

        }).then(resp => {
            if(!resp.data.user.role.name.toString().includes('uam')) throw new InternalServerErrorException('Internal Server Error');
            else {
                return {
                    username : resp.data.user.username,
                    email:  resp.data.user.email,
                    organization : resp.data.user.organization,
                    jwt : resp.data.jwt, 
                    refresh : resp.data.refresh, 
                    role : resp.data.user.role.name
                    
                }
            }
        }).catch(()=>{
            throw new InternalServerErrorException('Internal Server Error');
        })
    }

    async me(token: String): Promise<any> {
        const graphQLAuthClient = new GraphQLClient(graphQLConfig.url, {
            headers: {
              authorization: 'Bearer ' + token,
            },
        });

        const query1 = gql`
        {
            me  
                {
                    email
                    username
                    user {
                        organization
                    }
                    role {
                        name
                    }
                }
        }`;

        let data = await graphQLAuthClient.request(query1);

        const organization = JSON.parse(JSON.stringify(data.me.user.organization)); 
        const role = JSON.parse(JSON.stringify(data.me.role.name)); 
        delete data.me.user;
        delete data.me.role;

        data.me.organization = organization; 
        data.me.role = role; 
        data.me.jwt = token; 

        return data.me
    }

    async refresh(token: String): Promise<any> {
        const query = gql`
        mutation  {
            refreshToken(token :"` + token + `", renew:true) {
                jwt
                refresh
            }
        }
        `;
        let data = await graphQLNoAuthClient.request(query);
        return data.refreshToken
    }
}
