import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { DataService } from '../../services/data';
import { Producto } from '../../models/models';
import { ClpPipe } from '../../pipes/clp-pipe';

/** Mantenedor de productos (solo admin): crear, editar y eliminar. */
@Component({
  selector: 'app-admin-productos',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ClpPipe],
  templateUrl: './admin-productos.html',
})
export class AdminProductos implements OnInit {
  private fb = inject(FormBuilder);
  protected auth = inject(AuthService);
  private data = inject(DataService);

  readonly categorias = ['Estrategia', 'Cooperativos', 'Cartas', 'Party Games'];
  productos: Producto[] = [];
  editId: string | null = null;
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

  get tituloForm(): string {
    return this.editId ? '// Editando producto' : '// Nuevo producto';
  }

  ngOnInit(): void {
    this.refrescar();
  }

  private refrescar(): void {
    this.productos = this.data.productos();
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
    this.editId = p.id;
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
    this.editId = null;
    this.form.reset({ precio: 0, stock: 0, precioOld: null });
    this.mensaje = '';
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const lista = this.data.productos();
    let msg: string;

    if (this.editId) {
      const i = lista.findIndex((p) => p.id === this.editId);
      if (i !== -1) {
        lista[i] = {
          ...lista[i],
          nombre: v.nombre!,
          categoria: v.categoria!,
          precio: Number(v.precio),
          precioOld: v.precioOld ? Number(v.precioOld) : null,
          stock: Number(v.stock),
          img: v.img || lista[i].img,
          desc: v.desc!,
        };
      }
      msg = 'Producto actualizado.';
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
      lista.push(nuevo);
      msg = 'Producto agregado.';
    }

    this.data.guardarProductos(lista);
    this.refrescar();
    this.cancelar();
    this.esError = false;
    this.mensaje = msg;
  }

  eliminar(id: string): void {
    const lista = this.data.productos().filter((p) => p.id !== id);
    this.data.guardarProductos(lista);
    this.refrescar();
    this.esError = false;
    this.mensaje = 'Producto eliminado.';
    if (this.editId === id) this.cancelar();
  }
}
