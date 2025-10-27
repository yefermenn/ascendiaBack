import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("usuarios_redes_pkey", ["idRed"], { unique: true })
@Entity("usuarios_redes", { schema: "public" })
export class UsuariosRedes {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_red" })
  idRed: number;

  @Column("character varying", {
    name: "plataforma",
    nullable: true,
    length: 100,
  })
  plataforma: string | null;

  @Column("character varying", { name: "url", nullable: true, length: 255 })
  url: string | null;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.usuariosRedes, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario: Usuarios;
}
