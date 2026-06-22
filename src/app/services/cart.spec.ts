import { TestBed } from '@angular/core/testing';
import { CartService } from './cart';

describe('CartService (lógica del carrito)', () => {
  let cart: CartService;

  beforeEach(() => {
    // Limpiamos el almacenamiento antes de cada prueba para recargar los productos
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    cart = TestBed.inject(CartService);
  });

  it('agrega un producto existente y calcula el total', () => {
    const r = cart.agregar('catan', 1);
    expect(r.ok).toBeTrue();
    expect(cart.totalItems()).toBe(1);
    expect(cart.totalCLP()).toBe(34990);
  });

  it('suma cantidades cuando se agrega el mismo producto dos veces', () => {
    cart.agregar('catan', 1);
    cart.agregar('catan', 2);
    expect(cart.totalItems()).toBe(3);
    expect(cart.totalCLP()).toBe(34990 * 3);
  });

  it('falla al agregar un producto que no existe', () => {
    const r = cart.agregar('no-existe', 1);
    expect(r.ok).toBeFalse();
    expect(r.error).toContain('no encontrado');
  });

  it('quita un producto del carrito', () => {
    cart.agregar('catan', 1);
    cart.quitar('catan');
    expect(cart.totalItems()).toBe(0);
  });

  it('vacía el carrito por completo', () => {
    cart.agregar('catan', 1);
    cart.agregar('coup', 1);
    cart.vaciar();
    expect(cart.obtener().length).toBe(0);
  });
});
