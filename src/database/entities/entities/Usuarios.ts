import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cursos } from "./Cursos";
import { Educacion } from "./Educacion";
import { ExperienciaLaboral } from "./ExperienciaLaboral";
import { Proyectos } from "./Proyectos";

@Index("usuarios_correo_key", ["correo"], { unique: true })
@Index("usuarios_pkey", ["idUsuario"], { unique: true })
@Index("idx_usuarios_nivel", ["nivelActual"], {})
@Entity("usuarios", { schema: "public" })
export class Usuarios {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_usuario" })
  idUsuario: number;

  @Column("character varying", { name: "nombre", length: 100 })
  nombre: string;

  @Column("character varying", {
    name: "first_name",
    nullable: true,
    length: 100,
  })
  firstName: string | null;

  @Column("character varying", {
    name: "last_name",
    nullable: true,
    length: 100,
  })
  lastName: string | null;

  @Column("character varying", { name: "correo", unique: true, length: 100 })
  correo: string;

  @Column("character varying", { name: "contraseña_hash", length: 255 })
  contraseAHash: string;

  @Column("text", { name: "biografia", nullable: true })
  biografia: string | null;

  @Column("integer", { name: "nivel_actual", nullable: true })
  nivelActual: number | null;

  @Column("integer", { name: "xp_total", nullable: true, default: () => "0" })
  xpTotal: number | null;

  @Column("timestamp without time zone", {
    name: "fecha_registro",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaRegistro: Date | null;

  @Column("character varying", {
    name: "foto_perfil",
    nullable: true,
    length: 255,
  })
  fotoPerfil: string | null;

  // Nuevo: URL directa de la foto según payload
  @Column("character varying", {
    name: "photo_url",
    nullable: true,
    length: 255,
  })
  photoUrl: string | null;

  // Campo profesional
  @Column("character varying", {
    name: "professional_category",
    nullable: true,
    length: 100,
  })
  professionalCategory: string | null;

  @Column("character varying", {
    name: "professional_specialty",
    nullable: true,
    length: 150,
  })
  professionalSpecialty: string | null;

  // Avatar
  @Column("character varying", {
    name: "avatar_gender",
    nullable: true,
    length: 50,
  })
  avatarGender: string | null;

  @Column("character varying", {
    name: "avatar_shirt_color",
    nullable: true,
    length: 20,
  })
  avatarShirtColor: string | null;

  @Column("character varying", {
    name: "rol",
    nullable: true,
    length: 20,
    default: () => "'usuario'",
  })
  rol: string | null;

  @Column("boolean", { name: "estado", nullable: true, default: () => "true" })
  estado: boolean | null;

  @OneToMany(() => Cursos, (cursos) => cursos.idUsuario)
  cursos: Cursos[];

  @OneToMany(() => Educacion, (educacion) => educacion.idUsuario)
  educacions: Educacion[];

  @OneToMany(() => ExperienciaLaboral, (experienciaLaboral) => experienciaLaboral.idUsuario)
  experienciaLaborals: ExperienciaLaboral[];

  @OneToMany(() => Proyectos, (proyectos) => proyectos.idUsuario2)
  proyectos: Proyectos[];
}
