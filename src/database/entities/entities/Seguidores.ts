import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("seguidores_pkey", ["idSeguido", "idSeguidor"], { unique: true })
@Entity("seguidores", { schema: "public" })
export class Seguidores {
  @Column("integer", { primary: true, name: "id_seguidor" })
  idSeguidor: number;

  @Column("integer", { primary: true, name: "id_seguido" })
  idSeguido: number;

  @Column("timestamp without time zone", {
    name: "fecha",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fecha: Date | null;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.seguidores, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_seguido", referencedColumnName: "idUsuario" }])
  idSeguido2: Usuarios;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.seguidores2, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_seguidor", referencedColumnName: "idUsuario" }])
  idSeguidor2: Usuarios;
}
