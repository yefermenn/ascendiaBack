import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("certificaciones_pkey", ["idCertificacion"], { unique: true })
@Index("idx_certificaciones_usuario", ["idUsuario"], {})
@Entity("certificaciones", { schema: "public" })
export class Certificaciones {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_certificacion" })
  idCertificacion: number;

  @Column("integer", { name: "id_usuario", nullable: true })
  idUsuario: number | null;

  @Column("character varying", { name: "titulo", length: 150 })
  titulo: string;

  @Column("character varying", { name: "entidad", nullable: true, length: 150 })
  entidad: string | null;

  @Column("date", { name: "fecha_obtencion", nullable: true })
  fechaObtencion: string | null;

  @Column("character varying", {
    name: "url_certificado",
    nullable: true,
    length: 255,
  })
  urlCertificado: string | null;

  @Column("boolean", {
    name: "validado",
    nullable: true,
    default: () => "false",
  })
  validado: boolean | null;

  @Column("integer", {
    name: "xp_otorgado",
    nullable: true,
    default: () => "0",
  })
  xpOtorgado: number | null;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.certificaciones, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario2: Usuarios;
}
