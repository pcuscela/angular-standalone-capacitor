import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
	constructor(
		private http: HttpClient,
		private config: ConfigService,
	) {}

	testGet(code: number) {
		return this.http.get(this.config.configuration.apiUrl + `/status/${code}`);
	}

	testGetResponse() {
		return this.http.get(this.config.configuration.apiUrl + `/uuid`);
	}

	testGetImage() {
		return this.http.get(this.config.configuration.apiUrl + `/image/jpeg`, { responseType: 'blob' });
	}
}
