import { Injectable } from "@angular/core";
import { Auth } from "aws-amplify";

import { User } from "./user.model";


//var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
//var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
//import { CognitoUser, CognitoUserAttribute, CognitoUserPool } from "@aws-amplify/auth";
import { CognitoUser, CognitoUserAttribute, CognitoUserPool, AuthenticationDetails, CognitoUserSession } from "amazon-cognito-identity-js";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

const POOL_DATA = {
    UserPoolId: "eu-west-1_TQ0nGNZIl",
    ClientId: "558tb1s0g45k7lqcgtv7she7fk"
};

const userPool = new CognitoUserPool(POOL_DATA);

@Injectable({ providedIn: 'root' })
export class AuthService {
    userSubject = new BehaviorSubject<User | null>(null);


    constructor(private router: Router) {
      
    }




    async signUp(username: string, email: string, password: string) {

        const emailAttribute = {
            Name: "email",
            Value: email
        }
        const attrList: CognitoUserAttribute[] = [];
        attrList.push(new CognitoUserAttribute(emailAttribute));


        userPool.signUp(username, password, attrList, [], (err, result) => {
            if (err) {
                console.log("error1");
                console.log(err);
                return;
            }

        })
    }

    async confirmSignUp(username: string, code: string) {
        const userData = {
            Username: username,
            Pool: userPool
        };
        const cognitoUser = new CognitoUser(userData);
        cognitoUser.confirmRegistration(code, true, (err, res) => {
            if (err) {
                console.log("Not confirmed");
                console.log(err);
                return;
            }
            this.router.navigate(["/blogs"]);
        });

    }

    async signIn(username: string, password: string) {
        const authData = {
            Username: username,
            Password: password
        }
        const authDetails = new AuthenticationDetails(authData);
        const userData = {
            Username: username,
            Pool: userPool
        };
        const cognitoUser = new CognitoUser(userData);
        let that = this;
        cognitoUser.authenticateUser(authDetails, {
            onSuccess(result: CognitoUserSession) {
                that.authenticateUser();
            },
            onFailure(err) {
                console.log(err);
            }
        })

    }

    getAuthenticatedUser() {
        return userPool.getCurrentUser();
    }

    getJWTToken() {
        let token;
        this.getAuthenticatedUser()?.getSession((err: any, session: any) =>{
            token = session.getIdToken().getJwtToken();
        })
        return token;
    }


    async authenticateUser() {
        
        let user = this.getAuthenticatedUser();
        

        if (user) {
            user.getSession((err: any, session: any) => {
                console.log(session);
                if (err) {
                    this.userSubject.next(null);
                } else {
                    if (session.isValid()) {
                        if (user) {
                            user.getUserData((err, res) => {
                                if (err) {
                                    console.log("error")
                                    console.log(err)
                                }
                                if (res) {
                                    if (user) {
                                        let loggedInUser = new User(res.UserAttributes[0].Value, res.Username, res.UserAttributes[2].Value);
                                        //console.log(loggedInUser);
                                        this.userSubject.next(loggedInUser);
                                    }
                                }
                            })
                        }
                    } else {
                        this.userSubject.next(null);
                    }
                }
            })
        } else {
            this.userSubject.next(null);
        }

    }

    async logOut() {
        this.getAuthenticatedUser()?.signOut;
        this.userSubject.next(null);
    }

    async onAuthorize() {
        Auth.federatedSignIn().then(res => {
            this.authenticateUser();
        });

    }


}