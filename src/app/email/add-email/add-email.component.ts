import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {global_params} from '../../global';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthorizationService} from '../../authorization.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-add-email',
    templateUrl: './add-email.component.html',
    styleUrls: ['./add-email.component.scss']
})
export class AddEmailComponent implements OnInit {

    public pair: any = {};
    public email: string;
    public password: string;
    form: FormGroup;
    tab_open = 1;
    hide_inputs = false;

// , FormBuilder, FormGroup
    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    ) {
    }

    ngOnInit() {
    /*        this.form = this.builder.group({
                password: [],
                email: [],
            });*/
    }

    testBox() {
        console.log(this.pair);
        this.httpPost(
            `${global_params.ip}/mail/box/create`,
            {
                'address': this.pair.email,
                'password': this.pair.password,
            }).subscribe(() => {
        });


        this.router.navigate(['/add_email/welcome']);
    }

    onClose() {
        this.router.navigate(['/email']);
    }
    public httpPost(url: string, body, options?): Observable<any> {
        return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
    }

    test(e) {
        if (e.target.value === 'one_tab') {
            this.tab_open = 1;
        }
        if (e.target.value === 'two_tab') {
            this.tab_open = 2;
        }
    }

    toggle_password_show() {
        const password_inp = document.querySelector('.password');
        const current_attribute = password_inp.getAttribute('type');
        if (current_attribute === 'password') {
            password_inp.setAttribute('type', 'text');
        } else {
            password_inp.setAttribute('type', 'password');
        }
    }

    toggle_edit_login(e) {
        const bool = e.target.checked;

        if (!bool) {
            this.hide_inputs = true;
        } else {
            this.hide_inputs = false;
        }
    }
}

