import { Injectable } from "@angular/core";
import { RegisterForm } from "./register-form.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { exctractApiError } from "src/app/shared/helpers/functions";
import { JwtHelperService } from "@auth0/angular-jwt";
import * as moment from "moment";

const jwt = new JwtHelperService();

class DecodedToken {
  exp: number = 0;
  username: string = "";
  userId: string = "";
}

// '16:36' < '18:36' - not expired!
// '16:36' < '15:36' - expired!
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private decodedToken: DecodedToken;

  constructor(private http: HttpClient) {
    this.decodedToken = new DecodedToken();
  }

  //'/api/v1/users/register'
  register(formData: RegisterForm): Observable<any> {
    return this.http
      .post("/api/v1/users/register", formData)
      .pipe(
        catchError((resError: HttpErrorResponse) =>
          throwError(exctractApiError(resError))
        )
      );
  }

  login(formData: any) {
    return this.http.post("/api/v1/users/login", formData).pipe(
      map((token: string) => {
        this.saveToken(token);
        return token;
      }),
      catchError((resError: HttpErrorResponse) =>
        throwError(exctractApiError(resError))
      )
    );
  }

  private saveToken(token: string): string | null {
    const decodedToken = jwt.decodeToken(token);
    if (!decodedToken) {
      return null;
    }

    this.decodedToken = decodedToken;

    localStorage.setItem("bwm_auth_token", token);
    return token;
  }

  get isAuthenticated(): boolean {
    return moment().isBefore(this.expiration);
  }

  get username(): string {
    return this.decodedToken.username;
  }

  private get expiration() {
    return moment.unix(this.decodedToken.exp);
  }
}
