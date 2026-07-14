import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ProductosApiService } from '../../services/productos-api';
import { Producto } from '../../models/models';
import { ClpPipe } from '../../pipes/clp-pipe';

/**
 * Mantenedor de productos (solo admin). Crea, edita y elimina productos
 * contra la API REST: POST para crear, PUT para actualizar y DELETE para
 * eliminar. El listado se obtiene con GET.
 */
@Component({
  selector: 'app-admin-productos',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ClpPipe],
  templateUrl: './admin-productos.html',
})
export class AdminProductos implements OnInit {
  private fb = inject(FormBuilder);
  protected auth = inject(AuthService);
  protected api = inject(ProductosApiService);

  readonly categorias = ['Estrategia', 'Cooperativos', 'Cartas', 'Party Games'];
  editando: Producto | null = null;
  mensaje = '';
  esError = false;

  form = this.fb.group({
    nombre: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    precio: [0, [Validators.required, Validators.min(0)]],
    precioOld: [null as number | null],
    stock: [0, [Validators.required, Validators.min(0)]],
    img: [''],
    desc: ['', [Validators.required]],
  });

  get f() {
    return this.form.controls;
  }

  get productos(): Producto[] {
    return this.api.productos();
  }

  get tituloForm(): string {
    return this.editando ? '// Editando producto' : '// Nuevo producto';
  }

  ngOnInit(): void {
    this.api.cargar();
  }

  private generarId(nombre: string): string {
    const base = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    let id = base;
    let n = 2;
    while (this.productos.some((p) => p.id === id)) {
      id = base + '-' + n;
      n++;
    }
    return id;
  }

  editar(p: Producto): void {
    this.editando = p;
    this.form.patchValue({
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      precioOld: p.precioOld,
      stock: p.stock,
      img: p.img,
      desc: p.desc,
    });
    this.mensaje = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelar(): void {
    this.editando = null;
    this.form.reset({ precio: 0, stock: 0, precioOld: null });
    this.mensaje = '';
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();

    // El precio anterior solo tiene sentido si es mayor al precio actual
    if (v.precioOld && Number(v.precioOld) <= Number(v.precio)) {
      this.esError = true;
      this.mensaje = 'El precio anterior debe ser mayor al precio actual de la oferta.';
      return;
    }

    if (this.editando) {
      const actualizado: Producto = {
        ...this.editando,
        nombre: v.nombre!,
        categoria: v.categoria!,
        precio: Number(v.precio),
        precioOld: v.precioOld ? Number(v.precioOld) : null,
        stock: Number(v.stock),
        img: v.img || this.editando.img,
        desc: v.desc!,
      };
      this.api.actualizar(actualizado).subscribe({
        next: () => this.exito('Producto actualizado.'),
        error: () => this.fallo('No se pudo actualizar el producto en la API.'),
      });
    } else {
      const nuevoId = this.generarId(v.nombre!);
      const nuevo: Producto = {
        id: nuevoId,
        nombre: v.nombre!,
        categoria: v.categoria!,
        precio: Number(v.precio),
        precioOld: v.precioOld ? Number(v.precioOld) : null,
        stock: Number(v.stock),
        img: v.img || 'img/juegos/' + nuevoId + '.jpg',
        desc: v.desc!,
      };
      this.api.crear(nuevo).subscribe({
        next: () => this.exito('Producto agregado.'),
        error: () => this.fallo('No se pudo crear el producto en la API.'),
      });
    }
  }

  eliminar(p: Producto): void {
    this.api.eliminar(p).subscribe({
      next: () => {
        if (this.editando?.id === p.id) this.cancelar();
        this.exito('Producto eliminado.');
      },
      error: () => this.fallo('No se pudo eliminar el producto en la API.'),
    });
  }

  private exito(msg: string): void {
    this.cancelar();
    this.esError = false;
    this.mensaje = msg;
    this.api.cargar(true);
  }

  private fallo(msg: string): void {
    this.esError = true;
    this.mensaje = msg;
  }
}
