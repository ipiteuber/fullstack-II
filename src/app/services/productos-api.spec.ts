import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProductosApiService } from './productos-api';
import { API_URL } from './api.config';
import { Producto } from '../models/models';

describe('ProductosApiService (API REST con GET, POST, PUT y DELETE)', () => {
  let api: ProductosApiService;
  let httpMock: HttpTestingController;
  const URL_PRUEBA = 'https://linkstart-test-rtdb.firebaseio.com';

  const producto: Producto = {
    id: 'catan',
    nombre: 'Catan',
    categoria: 'Estrategia',
    precio: 34990,
    precioOld: null,
    stock: 12,
    img: 'img/juegos/catan.jpg',
    desc: 'El clasico de comercio y construccion.',
    fbKey: 'abc123',
  };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: URL_PRUEBA },
      ],
    });
    api = TestBed.inject(ProductosApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('GET: carga el catalogo desde la API y guarda las claves de Firebase', () => {
    api.cargar();
    const req = httpMock.expectOne(`${URL_PRUEBA}/productos.json`);
    expect(req.request.method).toBe('GET');
    req.flush({ abc123: { ...producto, fbKey: undefined } });

    expect(api.productos().length).toBe(1);
    expect(api.productos()[0].fbKey).toBe('abc123');
    expect(api.remota()).toBeTrue();
  });

  it('POST: envia el producto nuevo a la API', () => {
    api.crear(producto).subscribe();
    const req = httpMock.expectOne(`${URL_PRUEBA}/productos.json`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.nombre).toBe('Catan');
    req.flush({ name: 'nuevaClave' });
  });

  it('PUT: actualiza el producto usando su clave de Firebase', () => {
    api.actualizar({ ...producto, stock: 99 }).subscribe();
    const req = httpMock.expectOne(`${URL_PRUEBA}/productos/abc123.json`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.stock).toBe(99);
    req.flush({});
  });

  it('DELETE: elimina el producto usando su clave de Firebase', () => {
    api.eliminar(producto).subscribe();
    const req = httpMock.expectOne(`${URL_PRUEBA}/productos/abc123.json`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
