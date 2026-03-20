import Back from "@/components/back";
import { EmptyState } from "@/components/empty-state";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { formatDate, parseTransaction } from "@/utils/helpers";
import { ITransactionDetail } from "@/utils/index";
import { useRouter } from "expo-router";
import { SearchNormal1, Setting3 } from "iconsax-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TransactionHistory = () => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    data: _transactions,
    onChangeParams,
    params,
    setParams,
    isLoading,
    ...other
  } = useRequest(TRANSACTION_SERVICE.TRANSACTION_LIST, {
    initialValue: [],
    params: {
      perPage: 20,
    },
  });

  const clearFilters = () =>
    setParams({
      currentPage: params.currentPage,
      perPage: params.perPage,
    });

  const removeParam = (key: string) => setParams(omit(params, [key]));

  const emptyTransaction = useMemo(
    () => Array.isArray(_transactions) && _transactions.length < 1,
    [_transactions],
  );

  const filters = useMemo(
    () => Object.keys(omit(params, ["currentPage", "perPage"])),
    [params],
  );

  return (
    <>
      <div className='brane-container h-full'>
        <Header
          handleBackPress={router.back}
          title='Transaction History'
          rightContent={
            <div onClick={onOpen}>
              <FilterIcon />
            </div>
          }
        />
        <div className='flex-1 flex-col flex gap-3 no-scrollbar overflow-y-auto pb-[40px]'>
          <div className='flex flex-col w-full gap-3'>
            {!emptyTransaction && (
              <FormInput
                wrapper='mb-[0px]'
                leftContent={<SearchIcon />}
                placeholder='Search transactions'
                value={params?.search}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeParams({ search: event.target.value })
                }
              />
            )}

            {!!filters.length && (
              <div className='overflow-x-auto w-full no-scrollbar'>
                <div className='flex flex-row gap-2 min-w-max'>
                  {filters.map((key: string, i: number) => {
                    const isDate = ["startDate", "endDate"].includes(key);
                    return (
                      <Tags
                        key={i}
                        border='1px solid #F3EED8'
                        bg='#F8F5E8'
                        bRadius='8px'
                        p='5px 8px 5px 10px'
                      >
                        <div className='flex gap-[8px] items-center'>
                          <span className='text-[#013D25]'>
                            {isDate
                              ? formatDate(params[key], "MMMM dd, yyyy")
                              : params[key]}
                          </span>
                          <span
                            onClick={() => removeParam(key)}
                            className='cursor-pointer'
                          >
                            <CloseIcon />
                          </span>
                        </div>
                      </Tags>
                    );
                  })}
                </div>
              </div>
            )}

            {!!filters.length && (
              <span
                className='font-medium text-[14px] text-[#013D25] underline cursor-pointer'
                onClick={clearFilters}
              >
                Clear all Filters
              </span>
            )}

            {isLoading && (
              <div className='flex justify-center items-center w-full'>
                <Spinner color='primary' />
              </div>
            )}
          </div>

          <div className='mb-[50px]'>
            <GroupedTransactions transactions={_transactions} />
            {_transactions?.length > 0 && (
              <Pagination
                align='center'
                current={other.currentPage}
                pageSize={other?.perPage || params.perPage || 20}
                total={other?.totalRecords || 0}
                onChange={(page, pageSize) => {
                  onChangeParams({
                    page: Number(page),
                    perPage: pageSize,
                  });
                }}
                showSizeChanger
                responsive
                size='small'
                pageSizeOptions={["10", "20", "50", "100"]}
              />
            )}
          </div>
        </div>

        <BraneModal isOpen={isOpen} onOpenChange={onOpenChange}>
          <h1 className='text-[16px]'>Filter</h1>
          <div className='flex flex-col gap-6'>
            <div className='border-b-2 border-[#f7f7f8] py-3 flex flex-col gap-4'>
              <p className='font-[600]'>Status</p>
              <RadioGroup
                size='lg'
                value={params?.status}
                onValueChange={(value) => onChangeParams({ status: value })}
              >
                <Radio
                  classNames={{
                    base: cn(
                      "inline-flex items-center justify-between",
                      "flex-row-reverse max-w-[500px] cursor-pointer gap-4 border-transparent",
                    ),
                    label: "text-[#0B0014] text-[14px] font-medium",
                    labelWrapper: "ml-0 my-4",
                  }}
                  value='pending'
                >
                  Pending
                </Radio>
                <Radio
                  classNames={{
                    base: cn(
                      "inline-flex items-center justify-between",
                      "flex-row-reverse max-w-[500px] cursor-pointer gap-4 border-transparent",
                    ),
                    label: "text-[#0B0014] text-[14px] font-medium",
                    labelWrapper: "ml-0 my-4",
                  }}
                  value='success'
                >
                  Success
                </Radio>
                <Radio
                  classNames={{
                    base: cn(
                      "inline-flex items-center justify-between",
                      "flex-row-reverse max-w-[500px] cursor-pointer gap-4 border-transparent",
                    ),
                    label: "text-[#0B0014] text-[14px] font-medium",
                    labelWrapper: "ml-0 my-4",
                  }}
                  value='failed'
                >
                  Failed
                </Radio>
              </RadioGroup>
            </div>

            <div className='border-b-2 border-[#f7f7f8] py-3 flex flex-col gap-4'>
              <p className='font-[600]'>Type</p>
              <RadioGroup
                size='lg'
                value={params?.type}
                onValueChange={(value) => onChangeParams({ type: value })}
              >
                <Radio
                  classNames={{
                    base: cn(
                      "inline-flex items-center justify-between",
                      "flex-row-reverse max-w-[500px] cursor-pointer gap-4 border-transparent",
                    ),
                    label: "text-[#0B0014] text-[14px] font-medium",
                    labelWrapper: "ml-0 my-4",
                  }}
                  value='Airtime'
                >
                  Airtime
                </Radio>
                <Radio
                  classNames={{
                    base: cn(
                      "inline-flex items-center justify-between",
                      "flex-row-reverse max-w-[500px] cursor-pointer gap-4 border-transparent",
                    ),
                    label: "text-[#0B0014] text-[14px] font-medium",
                    labelWrapper: "ml-0 my-4",
                  }}
                  value='Data'
                >
                  Data
                </Radio>
                <Radio
                  classNames={{
                    base: cn(
                      "inline-flex items-center justify-between",
                      "flex-row-reverse max-w-[500px] cursor-pointer gap-4 border-transparent",
                    ),
                    label: "text-[#0B0014] text-[14px] font-medium",
                    labelWrapper: "ml-0 my-4",
                  }}
                  value='Buy Stocks'
                >
                  Stock
                </Radio>
                <Radio
                  classNames={{
                    base: cn(
                      "inline-flex items-center justify-between",
                      "flex-row-reverse max-w-[500px] cursor-pointer gap-4 border-transparent",
                    ),
                    label: "text-[#0B0014] text-[14px] font-medium",
                    labelWrapper: "ml-0 my-4",
                  }}
                  value='Stock Swap'
                >
                  Bracs
                </Radio>
                <Radio
                  classNames={{
                    base: cn(
                      "inline-flex items-center justify-between",
                      "flex-row-reverse max-w-[500px] cursor-pointer gap-4 border-transparent",
                    ),
                    label: "text-[#0B0014] text-[14px] font-medium",
                    labelWrapper: "ml-0 my-4",
                  }}
                  value='Wallet Top Up'
                >
                  Wallet Top Up
                </Radio>
                <Radio
                  classNames={{
                    base: cn(
                      "inline-flex items-center justify-between",
                      "flex-row-reverse max-w-[500px] cursor-pointer gap-4 border-transparent",
                    ),
                    label: "text-[#0B0014] text-[14px] font-medium",
                    labelWrapper: "ml-0 my-4",
                  }}
                  value='Wallet Deduction'
                >
                  Wallet Deduction
                </Radio>
              </RadioGroup>
            </div>

            <div className='max-w-full'>
              <p className='font-[600]'>Date</p>
              <div className='flex flex-row gap-6 items-center mt-3 justify-between'>
                <div className='flex flex-col gap-3'>
                  <p>Start Date</p>
                  <DatePicker
                    {...(params?.startDate && {
                      defaultValue: dayjs(params.startDate, "YYYY/MM/DD"),
                    })}
                    size='large'
                    onChange={(date, dateString) => {
                      if (dateString) onChangeParams({ startDate: dateString });
                    }}
                  />
                </div>
                <span className='w-[12px] h-[2px] bg-[#013d25c5] mt-8'></span>
                <div className='flex flex-col gap-3'>
                  <p>End Date</p>
                  <DatePicker
                    {...(params?.endDate && {
                      defaultValue: dayjs(params.endDate, "YYYY/MM/DD"),
                    })}
                    size='large'
                    onChange={(date, dateString) => {
                      if (dateString) onChangeParams({ endDate: dateString });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </BraneModal>
      </div>
      <TabsNav />
    </>
  );
};

export default TransactionHistory;
