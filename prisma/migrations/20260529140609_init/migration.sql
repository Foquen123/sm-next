-- CreateTable
CREATE TABLE "pattern" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "pattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "patronymic" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "pattern_color" TEXT NOT NULL,
    "pattern_id" INTEGER NOT NULL,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_subjects" (
    "teacher_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,

    CONSTRAINT "teacher_subjects_pkey" PRIMARY KEY ("teacher_id","subject_id")
);

-- CreateTable
CREATE TABLE "classroom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_allow_conflicts" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "classroom_id" INTEGER NOT NULL,

    CONSTRAINT "lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_cell" (
    "id" SERIAL NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "order_in_day" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "lesson1_id" INTEGER NOT NULL,
    "lesson2_id" INTEGER,
    "table_type" TEXT NOT NULL,

    CONSTRAINT "schedule_cell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pgmigrations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "run_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pgmigrations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_pattern_id_fkey" FOREIGN KEY ("pattern_id") REFERENCES "pattern"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_subjects" ADD CONSTRAINT "teacher_subjects_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_subjects" ADD CONSTRAINT "teacher_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_cell" ADD CONSTRAINT "schedule_cell_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_cell" ADD CONSTRAINT "schedule_cell_lesson1_id_fkey" FOREIGN KEY ("lesson1_id") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_cell" ADD CONSTRAINT "schedule_cell_lesson2_id_fkey" FOREIGN KEY ("lesson2_id") REFERENCES "lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
