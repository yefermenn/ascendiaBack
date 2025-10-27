import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("admin_pkey", ["idAdmin"], { unique: true })
@Index("admin_id_usuario_key", ["idUsuario"], { unique: true })
@Entity("admin", { schema: "public" })
export class Admin {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_admin" })
  idAdmin: number;

  @Column("integer", { name: "id_usuario", nullable: true, unique: true })
  idUsuario: number | null;

  @Column("jsonb", { name: "permisos", nullable: true })
  permisos: object | null;

  @Column("timestamp without time zone", {
    name: "fecha_asignacion",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaAsignacion: Date | null;

  @OneToOne(() => Usuarios, (usuarios) => usuarios.admin, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario2: Usuarios;
}
