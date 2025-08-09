import styles from "./SubHeader.module.scss";
const SubHeader = () => {
  return (
    <div className={styles.subHeader}>
      <div>
        {/* <Button>Today</Button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
            <DemoItem label="Controlled picker" component="DateRangePicker">
              <DateRangePicker
                value={value}
                onChange={(newValue: any) => setValue(newValue)}
              />
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider> */}
        Subheader
      </div>
    </div>
  );
};

export default SubHeader;
