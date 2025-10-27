import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("notificaciones_pkey", ["idNotificacion"], { unique: true })
@Index("idx_notificaciones_usuario", ["idUsuario"], {})
@Entity("notificaciones", { schema: "public" })
export class Notificaciones {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_notificacion" })
  idNotificacion: number;

  @Column("integer", { name: "id_usuario", nullable: true })
  idUsuario: number | null;

  @Column("character varying", { name: "titulo", nullable: true, length: 100 })
  titulo: string | null;

  @Column("text", { name: "mensaje", nullable: true })
  mensaje: string | null;

  @Column("character varying", {
    name: "tipo",
    nullable: true,
    length: 20,
    default: () => "'sistema'",
  })
  tipo: string | null;

  @Column("boolean", { name: "leida", nullable: true, default: () => "false" })
  leida: boolean | null;

  @Column("timestamp without time zone", {
    name: "fecha_envio",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaEnvio: Date | null;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.notificaciones, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario2: Usuarios;
}
