-- CreateTable
CREATE TABLE "Resident" (
    "id" TEXT NOT NULL,
    "accountno" TEXT NOT NULL,
    "classtype" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullname" TEXT NOT NULL,
    "notification_token" TEXT,

    CONSTRAINT "Resident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Billing" (
    "id" TEXT NOT NULL,
    "accountno" TEXT NOT NULL,
    "amortamnt" TEXT NOT NULL,
    "arrearsamt" TEXT NOT NULL,
    "arrearsenv" TEXT NOT NULL,
    "b_status" TEXT NOT NULL,
    "bill_date" TEXT NOT NULL,
    "bill_no" TEXT NOT NULL,
    "billamt" INTEGER NOT NULL,
    "billbrgy" TEXT NOT NULL,
    "billpurok" TEXT NOT NULL,
    "book" TEXT NOT NULL,
    "classtype" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "curreading" TEXT NOT NULL,
    "custno" TEXT NOT NULL,
    "discon_date" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "due_date" TEXT NOT NULL,
    "due_penalty" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "m_penalty" TEXT NOT NULL,
    "mr_sys_no" TEXT NOT NULL,
    "mrrfdue" TEXT NOT NULL,
    "mtr_no" TEXT NOT NULL,
    "nrwater" TEXT NOT NULL,
    "paid" TEXT NOT NULL,
    "paymentReceipt" TEXT,
    "penalized" TEXT NOT NULL,
    "prereading" TEXT NOT NULL,
    "prevused" TEXT NOT NULL,
    "prevused2" TEXT NOT NULL,
    "prvbilldate" TEXT NOT NULL,
    "prvdiscon" TEXT NOT NULL,
    "prvduedate" TEXT NOT NULL,
    "purokcode" TEXT NOT NULL,
    "stubout" TEXT NOT NULL,
    "totalBill" INTEGER NOT NULL,
    "verified" TEXT NOT NULL,
    "waterusage" TEXT NOT NULL,
    "resident_id" TEXT,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "accountno" TEXT NOT NULL,
    "amortize" TEXT NOT NULL,
    "arrearsamnt" TEXT NOT NULL,
    "arrearsenv" TEXT NOT NULL,
    "bankgroup" TEXT NOT NULL,
    "bankid" TEXT NOT NULL,
    "bankonline" TEXT NOT NULL,
    "batchno" TEXT NOT NULL,
    "billno" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "cash" TEXT NOT NULL,
    "check" TEXT NOT NULL,
    "checkdate" TEXT NOT NULL,
    "checkno" TEXT NOT NULL,
    "cmrrfamnt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "custno" TEXT NOT NULL,
    "envfee" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "onlineref" TEXT NOT NULL,
    "othrappy" TEXT NOT NULL,
    "othrincome" TEXT NOT NULL,
    "othrreconn" TEXT NOT NULL,
    "pacyamnt" TEXT NOT NULL,
    "papyamnt" TEXT NOT NULL,
    "payarrears" TEXT NOT NULL,
    "pdiscamnt" TEXT NOT NULL,
    "penamnt" TEXT NOT NULL,
    "pmrrfamnt" TEXT NOT NULL,
    "pymtdate" TEXT NOT NULL,
    "pymtmethod" TEXT NOT NULL,
    "receiptno" TEXT NOT NULL,
    "receiptstatus" TEXT NOT NULL,
    "receipttype" TEXT NOT NULL,
    "runbalance" TEXT NOT NULL,
    "sysno" TEXT NOT NULL,
    "teller" TEXT NOT NULL,
    "trackdt" TEXT NOT NULL,
    "waterbill" TEXT NOT NULL,
    "resident_id" TEXT,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ledger" (
    "id" TEXT NOT NULL,
    "accountno" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "consumption" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "custno" TEXT NOT NULL,
    "reading" TEXT NOT NULL,
    "ref_code" TEXT NOT NULL,
    "ref_no" TEXT NOT NULL,
    "sequence" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "trans_date" TEXT NOT NULL,
    "resident_id" TEXT,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concern" (
    "id" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "resident_id" TEXT,

    CONSTRAINT "Concern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "resident_id" TEXT,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anouncement" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resident_id" TEXT,

    CONSTRAINT "Anouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq" (
    "id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coordinate" (
    "id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coordinate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resident_accountno_key" ON "Resident"("accountno");

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "Resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "Resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "Resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concern" ADD CONSTRAINT "Concern_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "Resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "Resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anouncement" ADD CONSTRAINT "Anouncement_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "Resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;
