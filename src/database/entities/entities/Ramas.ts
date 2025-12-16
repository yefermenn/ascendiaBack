import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cursos } from "./Cursos";
import { Usuarios } from "./Usuarios";

@Index("ramas_pkey", ["idRama"], { unique: true })
@Entity("ramas", { schema: "public" })
export class Ramas {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_rama" })
  idRama: number;

  @Column("character varying", { name: "nombre", length: 150 })
  nombre: string;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.ramas, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  usuario: Usuarios;

  @OneToMany(() => Cursos, (cursos) => cursos.rama)
  cursos: Cursos[];
}
